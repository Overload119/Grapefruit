Template.dashboard.helpers({
  isTutorialComplete: function() {
    return Meteor.user().isTutorialComplete;
  },
  isLoginConfigured: function() {
    return Accounts.loginServicesConfigured();
  }
});

Meteor.subscribe('currentUserProfile');
