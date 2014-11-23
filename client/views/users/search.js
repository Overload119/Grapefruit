Template.usersSearch.helpers({
  isLoginConfigured: function() {
    return Accounts.loginServicesConfigured();
  },
  isSearching: function() {
    return Session.get('searchQuery').trim() !== '';
  },
  searchResults: function() {
    return Session.get('searchResults');
  }
});

Template.usersSearch.events({
  'keyup #search-bar': function(evt, template) {
    // If they hit Enter, start a search.
    if (evt.keyCode === 13) {
      var searchQueryParams = {
        term: $(evt.currentTarget).val(),
        lat: Meteor.user().location[0],
        lng: Meteor.user().location[1]
      };

      Session.set('searchQuery', searchQueryParams.term);
      Meteor.call('searchQuery', searchQueryParams, function(err, result) {
        Session.set('searchResults', result);
      });
    }
  }
});

Template.usersSearch.created = function() {
  Session.setDefault('searchQuery', '');
}
