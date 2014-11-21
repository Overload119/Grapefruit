Accounts.onCreateUser(function(options, user) {
  var userProperties = {};

  if (options.profile) {
    user.firstName = options.profile.firstName;
    user.lastName  = options.profile.lastName;
    user.headline  = options.profile.headline;

    // TODO - the rest of this.
  }

  debugger

  console.log(options);
  console.log(user);

  console.log('onCreateUser called');
  var userProperties = {

  };
  return user;
});
