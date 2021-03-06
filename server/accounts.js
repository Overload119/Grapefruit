var debug = Meteor.npmRequire('debug')('accounts');

var populateKeywordsFromUser = function(user) {
  // Populate keywords from their Skills/Interests/Job Experience.
  _.each(user.interests, function(word) {
    Meteor.call('insertOrUpdateKeyword', word, 'interests');
  });

  _.each(user.skills, function(word) {
    Meteor.call('insertOrUpdateKeyword', word, 'skills');
  });

  _.each(user.jobExperience, function(word) {
    Meteor.call('insertOrUpdateKeyword', word, 'jobExperience');
  });

  return user;
}

Accounts.onLogin(function(options) {
  Meteor.users.update({ _id: options.user._id }, {
    $set: { lastActiveAt: new Date() }
  });
});

var updateLinkedInForUser = function(user, accessToken) {
  // Retrieve the fields we need from LinkedIn.
  // The LinkedIn package uses some defaults that aren't suitable for our needs.

  var linkedInFields = Constants.LINKED_IN_FIELDS.join(',');
  var url = 'https://api.linkedin.com/v1/people/~:(' + linkedInFields + ')';
  var linkedInFieldResponse = Meteor.http.get(url, {
    params: {
      oauth2_access_token: accessToken,
      format: 'json'
    }
  }).data;

  // Simple field copies
  user.firstName      = linkedInFieldResponse.firstName;
  user.lastName       = linkedInFieldResponse.lastName;
  user.headline       = linkedInFieldResponse.headline;
  user.linkedInUrl    = linkedInFieldResponse.publicProfileUrl;
  user.email          = linkedInFieldResponse.emailAddress;
  user.pictureUrl     = linkedInFieldResponse.pictureUrl;
  user.summary        = linkedInFieldResponse.summary;

  if (linkedInFieldResponse.pictureUrls && linkedInFieldResponse.pictureUrls._total > 0) {
    user.largePictureUrl = linkedInFieldResponse.pictureUrls.values[0];
  }

  // The following fields are us`ed when searching, and they are case-sensitive.
  // Therefore we bring them all to lowercase.

  // Process interests - Interests come in a string - we want them in an array.
  var interestsArr = [];
  if (linkedInFieldResponse.interests && linkedInFieldResponse.interests.trim() !== '') {
    interestsArr = _.map(linkedInFieldResponse.interests.split(','), function(interest) {
      return interest.trim().toLowerCase();
    });
    interestsArr = _.compact(interestsArr);
  }

  user.interests = interestsArr;

  // Process skills
  var skillsArr = [];
  if (linkedInFieldResponse.skills && linkedInFieldResponse.skills._total > 0) {
    skillsArr = _.map(linkedInFieldResponse.skills.values, function(skillObj) {
      return skillObj.skill.name.toLowerCase();
    });
  }
  user.skills = skillsArr;

  // Process job experience. Current positions first, then past positions (added to end of array).
  var jobExperienceArr = [];
  var _temp;

  if (linkedInFieldResponse.threeCurrentPositions &&
      linkedInFieldResponse.threeCurrentPositions._total > 0) {
    _temp = _.map(linkedInFieldResponse.threeCurrentPositions.values, function(posValue) {
      return posValue.company.name.toLowerCase();
    });

    jobExperienceArr = jobExperienceArr.concat(_temp);
  }

  if (linkedInFieldResponse.threePastPositions &&
      linkedInFieldResponse.threePastPositions._total > 0) {
    _temp = _.map(linkedInFieldResponse.threePastPositions.values, function(posValue) {
      return posValue.company.name.toLowerCase();
    });

    jobExperienceArr = jobExperienceArr.concat(_temp);
  }

  user.jobExperience = jobExperienceArr;
  user.lastActiveAt = new Date();

  return user;
}

Accounts.onCreateUser(function(options, user) {
  debug('onCreateUser fired.');

  var accessToken = user.services.linkedin.accessToken;
  updateLinkedInForUser(user, accessToken);
  populateKeywordsFromUser(user);

  return user;
});
