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
