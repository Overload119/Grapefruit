ThreadsController = FastRender.RouteController.extend({
});

Meteor.startup(function() {
  Router.route('/threads', {
    name: 'threadsIndex',
    template: 'threadsIndex',
    waitOn: function() {
      // Default to the first category.
      var category = Constants.THREAD_CATEGORIES[0].dbName;
      if (Session.get('currentCategory')) {
        category = Session.get('currentCategory');
      }

      return [
        Meteor.subscribe('discussions', category)
      ];
    },
    data: function() {
      return Threads.find({ isPrivate: false,  messageCount: { $gt: 0 }});
    },
    controller: ThreadsController
  });

  Router.route('/discussion-thread/:_id', {
    name: 'discussShow',
    template: 'discussShow',
    waitOn: function() {
      // Add 1 to the limit, so if there are more than the limit, we'll be able to show that
      // in the UI (to retrieve more.)
      return [
        Meteor.subscribe('threadWithUsers', this.params._id),
        Meteor.subscribe('threadMessages', this.params._id, Constants.DEFAULT_MESSAGES_LIMIT + 1),
      ];
    },
    data: function() {
      return Threads.findOne(this.params._id);
    },
    controller: ThreadsController
  });

  Router.route('/threads/:_id/users', {
    name: 'threadsUsers',
    template: 'threadsUsers',
    waitOn: function() {
      return [
        Meteor.subscribe('threadWithUsers', this.params._id),
        coreSubscriptions.subscribe('keywords')
      ];
    },
    data: function() {
      return Threads.findOne(this.params._id);
    },
    controller: ThreadsController
  });

  Router.route('/thread/:_id', {
    name: 'threadsShow',
    template: 'threadsShow',
    waitOn: function() {
      return [
        Meteor.subscribe('thread', this.params._id),
        Meteor.subscribe('threadMessages', this.params._id, Constants.DEFAULT_MESSAGES_LIMIT + 1),
        Meteor.subscribe('threadUsers', this.params._id)
      ];
    },
    data: function() {
      return Threads.findOne(this.params._id);
    },
    controller: ThreadsController
  });
});
