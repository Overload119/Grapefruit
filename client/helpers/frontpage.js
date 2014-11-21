Template.frontpage.events({
  'click #connect': function(evt, template) {
    var linkedInOptions = {
      requestPermissions: ['r_emailaddress', 'r_fullprofile']
    };
    Meteor.loginWithLinkedIn(linkedInOptions, function(e) {
      if (!e) {
      }
    });
  }
});

Template.frontpage.helpers({
  isLoginConfigured: function() {
    return Accounts.loginServicesConfigured();
  }
});
