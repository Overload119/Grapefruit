Template.registerHelper('formatName', function(user) {
  var result = '';
  if (user.firstName) {
    result += user.firstName;
  }
  if (user.lastName) {
    result += ' ';
    result += user.lastName;
  }
  return result;
});

Template.registerHelper('capitalizeEveryWord', function(tag) {
  check(tag, String);

  var result = '';
  var words = tag.split(' ');
  for (var i = 0; i < words.length; i++) {
    result += words[i][0].toUpperCase() + words[i].substring(1) + ' ';
  }
  return result.trim();
});

Template.registerHelper('pluralize', function(arrOrNumber, word) {
  if (arrOrNumber instanceof Array) {
    if (arrOrNumber.length === 0 || arrOrNumber.length > 1) {
      return word + 's';
    } else {
      return word;
    }
  } else if (typeof arrOrNumber === 'number') {
    if (arrOrNumber === 0 || arrOrNumber > 1) {
      return word + 's';
    } else {
      return word;
    }
  } else {
    return '???';
  }
});

Template.registerHelper('relativeTimeFromNow', function(date) {
  return moment(date).fromNow();
});

Template.registerHelper('largeProfileBackgroundImage', function(user) {
  if (user.largePictureUrl && user.largePictureUrl.trim() !== '') {
    return 'background-image: url(\'' + user.largePictureUrl + '\')';
  } else if (user.pictureUrl && user.pictureUrl.trim() !== '') {
    // Fallback to a smaller profile picture if possible.
    return 'background-image: url(\'' + user.pictureUrl + '\')';
  } else {
    return 'background-image: url(\'/img/default_profile.jpg\')';
  }
});

Template.registerHelper('profileBackgroundImage', function(user) {
  if (user.pictureUrl && user.pictureUrl.trim() !== '') {
    return 'background-image: url(\'' + user.pictureUrl + '\')';
  } else {
    return 'background-image: url(\'/img/default_profile.jpg\')';
  }
});

Template.registerHelper('distanceAwayInKm', function(km) {
  if (typeof km === 'undefined') {
    return '???';
  }

  if (typeof km === 'string') {
    try {
      km = parseFloat(km, 10);
    }
    catch (ex) {
      return '???';
    }
  }

  km = Math.round(km * 100)/100;

  if (km < 1) {
    return 'very close';
  } else {
    return 'approx. ' + km + 'km away';
  }
});
