Template.threadsUsers.helpers({
  rolesForUser: function() {
    var user = Meteor.users.findOne(this._id);
    debugger
    return user.listedAs || [];
  },
  usersInThread: function() {
    return Meteor.users.find({ _id: { $in: this.memberIds } });
  },
  isSearching: function() {
    return Session.get('tu_searchQuery').trim() !== '';
  },
  searchResults: function() {
    return Session.get('tu_searchResults');
  },
  suggestedKeywords: function() {
    return Session.get('tu_suggestedKeywords');
  },
  isSearchLoading: function() {
    return Session.get('tu_isSearchLoading');
  },
  searchQuery: function() {
    return Session.get('tu_searchQuery');
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
  'mouseover .profile-meta': function(evt, template) {
    var el = $(evt.currentTarget);

    if (!el.hasClass('tooltipstered')) {
      el.tooltipster({
        theme: 'tooltipster-light',
        contentAsHTML: true,
        animation: 'grow',
        speed: 250,
        position: 'left'
      });
    }
  },
  'click .clear-search-btn': function(evt, template) {
    evt.preventDefault();

    $('#search-bar').val('');
    Session.set('tu_searchQuery', '');
    Session.set('tu_suggestedKeywords', []);
    Session.set('tu_searchResults', []);
    Session.set('tu_isSearchingLoading', false);
  },
  'click .suggestion': function(evt, template) {
    var keywordContent = $(evt.currentTarget).data('rawcontent');
    $('#search-bar').val(keywordContent);
    Session.set('tu_searchQuery', keywordContent);

    template.triggerSearch();
  },
  'keyup #search-bar': function(evt, template) {
    var currentTerms = $(evt.currentTarget).val();
    Session.set('tu_searchQuery', currentTerms);

    if (currentTerms.length === 0) {
      Session.set('tu_suggestedKeywords', []);
      return;
    }

    if (currentTerms.length > 2) {
      // Only start fuzzy search after 2 character to make it more responsive.
      var suggestedTermIds = template.keywordFuzzySearch.search(currentTerms);
      var suggestedKeywords = Keywords.find({ _id: { $in: suggestedTermIds } } ).fetch();
      Session.set('tu_suggestedKeywords', suggestedKeywords);
    }

    // If they hit Enter, start a search.
    if (evt.keyCode === 13) {
      template.triggerSearch();
    }

    // Create a timeout after 1 second automatically do a search.
    clearTimeout(template.triggerSearchTimeout);
    template.triggerSearchTimeout = setTimeout(template.triggerSearch, 1100);
  }
});

Template.threadsUsers.rendered = function() {
  $('.profile-meta').tooltipster({
    theme: 'tooltipster-light',
    contentAsHTML: true,
    animation: 'grow',
    speed: 250,
    position: 'left'
  });
}

Template.threadsUsers.created = function() {
  // Keywords are subscribed and waitedOn in the router.
  this.keywordFuzzySearch = new Fuse(Keywords.find({}).fetch(), { keys: ['content'], id: '_id' });
  this.triggerSearchTimeout = null;
  this.triggerSearch = function() {
    var searchTerm = Session.get('tu_searchQuery');

    var searchParams = {
      term: searchTerm,
      searchType: 'users_in_thread',
      threadId: this.data._id
    };

    Session.set('tu_isSearchLoading', true);
    Meteor.call('searchQuery', searchParams, function(err, result) {
      Session.set('tu_searchResults', result);
      Session.set('tu_isSearchLoading', false);
    });
  }.bind(this);

  Session.set('tu_searchQuery', '');
  Session.set('tu_isSearchLoading', false);
  Session.set('tu_suggestedKeywords', []);
}
