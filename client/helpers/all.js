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

Template.registerHelper('profileBackgroundImage', function(user) {
  if (user.pictureUrl && user.pictureUrl.trim() !== '') {
    return 'background-image: url(\'' + user.pictureUrl + '\')';
  } else {
    return 'background-image: url(\'/default_profile.jpg\')';
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
