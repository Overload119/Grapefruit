Template.frontpage.events({
  'click #connect': function(evt, template) {
    var linkedInOptions = {
      requestPermissions: ['r_emailaddress', 'r_fullprofile'],
      loginStyle: 'redirect'
    };

    Meteor.loginWithLinkedIn(linkedInOptions, function(e) {
      if (e) {
        alert('Oh no! You weren\'t logged in. Here\'s why:\n\n' + e.message);
      } else {
        Router.go('/');
      }
    });
  }
});

Template.frontpage.helpers({
  isLoginConfigured: function() {
    return Accounts.loginServicesConfigured();
  }
});
