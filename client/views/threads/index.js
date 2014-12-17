var getThreadParameters = function (sort) {
  var threadCriteria = { isPrivate: false };

  // Always get +1 on the limit, so we can tell if we should "Show More"
  var threadOptions = {
    limit: Session.get('threadLimit'),
    sort: { lastActiveAt: -1 }
  };

  switch (sort) {
    case 'relevant':
      // Look for threads that contains keywords that the user has on their profile.
      var relevanceFactors = _.union(Meteor.user().interests, Meteor.user().skills);
      threadCriteria = {
        tags: {
          $in: relevanceFactors
        }
      };
      break;
    case 'active':
    default:
      break;
  };

  return {
    threadCriteria: threadCriteria,
    threadOptions: threadOptions
  };
};

Template.threadsIndex.helpers({
  activeIfSort: function(sortParam) {
    return Session.get('ti_sort') === sortParam ? 'active' : '';
  },
  threads: function() {
    var params = getThreadParameters(Session.get('ti_sort'));
    return Threads.find(params.threadCriteria, params.threadOptions);
  },
  hasThreads: function() {
    var params = getThreadParameters(Session.get('ti_sort'));
    return Threads.find(params.threadCriteria, params.threadOptions).count() > 0;
  },
  hasMoreThreads: function() {
    // Check if the number of threads we're subscribed to is larger than the number of shown threads.
    var params = getThreadParameters(Session.get('ti_sort'));

    // Ignore the sort params.
    return Threads.find(params.threadCriteria).count() >
      Session.get('threadLimit');
  },
  isLoadingThreads: function() {
    return Session.get('isLoadingThreads');
  }
});

Template.threadsIndex.events({
  'click .sort-bar button': function(evt, template) {
    var el = $(evt.currentTarget);
    var sortPref = el.data('value');

    Session.set('ti_sort', sortPref);
  },
  'click #create-thread': function(evt, template) {
    Router.go('threadsNew');
  },
  'click .show-more-btn': function(evt, template) {
    var oldLimit = Session.get('threadLimit');
    Session.set('threadLimit', oldLimit + Constants.DEFAULT_LIMIT);
    Session.set('isLoadingThreads', true);
    var params = getThreadParameters(Session.get('ti_sort'));

    // Subscribe to the additional threads. +1 on limit so we can show Show More if necessary.
    params.threadOptions.limit++;
    Meteor.subscribe('discussions', params.threadCriteria, params.threadOptions,
      function onReady() {
        Session.set('isLoadingThreads', false);
      });
  }
});

Template.threadsIndex.rendered = function() {
  // EpicEditor doesn't work well with our custom font.
  // if(Meteor.user() && !this.editor){
  //   this.editor = new EpicEditor(Constants.EPIC_EDITOR_OPTIONS).load();
  //   $(this.editor.editor).bind('keydown', 'meta+return', function() {
  //     $(window.editor).closest('form').find('input[type="submit"]').click();
  //   });
  // }
};

Template.threadsIndex.created = function() {
  Session.set('pageTitle', 'Community');
  Session.set('threadLimit', Constants.DEFAULT_LIMIT);
  Session.set('isLoadingThreads', false);
};
