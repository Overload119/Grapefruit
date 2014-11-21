Template.frontpage.events({
  'click #connect': function(evt, template) {
    var linkedInOptions = {
      requestPermissions: ['r_emailaddress', 'r_fullprofile']
    };
    Meteor.loginWithLinkedIn(linkedInOptions, function(e) {
      if (!e) {
        Router.go('/dashboard');
      }
    });
  }
});

Template.frontpage.helpers({
  isLoginConfigured: function() {
    return Accounts.loginServicesConfigured();
  }
});
