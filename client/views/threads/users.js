Template.threadsUsers.helpers({
  usersInThread: function() {
    return Meteor.users.find({ _id: { $in: this.memberIds } });
  },
  isSearching: function() {
    return Session.get('searchQuery').trim() !== '';
  },
  searchResults: function() {
    return Session.get('searchResults');
  },
  suggestedKeywords: function() {
    return Session.get('suggestedKeywords');
  },
  isSearchLoading: function() {
    return Session.get('isSearchLoading');
  },
  searchQuery: function() {
    return Session.get('searchQuery');
  },
  formatKeyword: function(keyword) {
    if (typeof keyword !== 'string') {
      throw new Meteor.Error('Incorrect type');
    }
    var result = '';
    var words = keyword.split(' ');
    for (var i = 0; i < words.length; i++) {
      result += words[i][0].toUpperCase() + words[i].substring(1) + ' ';
    }
    return result.trim();
  }
});

Template.threadsUsers.events({
  'click .clear-search-btn': function(evt, template) {
    evt.preventDefault();

    $('#search-bar').val('');
    Session.set('searchQuery', '');
    Session.set('isSearchingLoading', false);
  },
  'click .suggestion': function(evt, template) {
    var keywordContent = $(evt.currentTarget).data('rawcontent');
    $('#search-bar').val(keywordContent);
    Session.set('searchQuery', keywordContent);

    // Send a search request.
    var searchQueryParams = {
      term: keywordContent,
      lat: Meteor.user().location[0],
      lng: Meteor.user().location[1]
    };

    Session.set('isSearchLoading', true);
    Meteor.call('searchQuery', searchQueryParams, function(err, result) {
      Session.set('searchResults', result);
      Session.set('isSearchLoading', false);
    });
  },
  'keyup #search-bar': function(evt, template) {
    var currentTerms = $(evt.currentTarget).val();
    Session.set('searchQuery', currentTerms);

    if (currentTerms.length === 0) {
      Session.set('suggestedKeywords', []);
      return;
    }

    if (currentTerms.length > 2) {
      // Only start fuzzy search after 2 character to make it more responsive.
      var suggestedTermIds = template.keywordFuzzySearch.search(currentTerms);
      var suggestedKeywords = Keywords.find({ _id: { $in: suggestedTermIds } } ).fetch();
      Session.set('suggestedKeywords', suggestedKeywords);
    }

    // If they hit Enter, start a search.
    if (evt.keyCode === 13) {
      var searchQueryParams = {
        term: $(evt.currentTarget).val(),
        searchType: 'users_in_thread',
        threadId: this._id
      };

      Session.set('searchQuery', searchQueryParams.term);
      Session.set('isSearchLoading', true);
      Meteor.call('searchQuery', searchQueryParams, function(err, result) {
        Session.set('searchResults', result);
        Session.set('isSearchLoading', false);
      });
    }
  }
});

Template.threadsUsers.created = function() {
  // Keywords are subscribed and waitedOn in the router.
  this.keywordFuzzySearch = new Fuse(Keywords.find({}).fetch(), { keys: ['content'], id: '_id' });
  Session.setDefault('searchQuery', '');
  Session.setDefault('isSearchLoading', false);
  Session.setDefault('suggestedKeywords', []);
}
