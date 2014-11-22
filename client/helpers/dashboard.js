Template.dashboard.helpers({
  isTutorialComplete: function() {
    // This is a bit slow, so we check the localStorage as well.
    // This is faster than Meteor.user() which would show a flash on first load.
    var slowCheck = Meteor.user().isTutorialComplete;
    if (localStorage.getItem('isTutorialComplete')) {
      return true;
    }
    if (slowCheck) {
      localStorage.setItem('isTutorialComplete', true);
    }
    return slowCheck;
  },
  isLoginConfigured: function() {
    return Accounts.loginServicesConfigured();
  },
  isSearching: function() {
    return Session.get('searchQuery').trim() !== '';
  },
});

Template.dashboard.events({
  'keyup #search-bar': function(evt, template) {
    // If they hit Enter, start a search.
    if (evt.keyCode === 13) {
      var searchQueryParams = {
        term: $(evt.currentTarget).val(),
        lat: Meteor.user().location[0],
        lng: Meteor.user().location[1]
      };

      Meteor.call('searchQuery', searchQueryParams, function(err, result) {
        console.log(err);
        console.log(result);
      });
    }
  }
});

Template.dashboard.created = function() {
  Session.setDefault('searchQuery', '');
}

Meteor.subscribe('currentUserProfile');
