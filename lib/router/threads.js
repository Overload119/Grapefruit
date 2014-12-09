ThreadsController = FastRender.RouteController.extend({
});

Meteor.startup(function() {
  Router.route('/threads', {
    name: 'threadsIndex',
    template: 'threadsIndex',
    waitOn: function() {
      var firstCategory = Constants.THREAD_CATEGORIES[0].dbName;
      return [
        Meteor.subscribe('discussions', firstCategory)
      ];
    },
    data: function() {
      return Threads.find({ isPrivate: false,  messageCount: { $gt: 0 }});
    },
    controller: ThreadsController
  });

  Router.route('/discussion/:_id', {
    name: 'discussShow',
    template: 'discussShow',
    waitOn: function() {
      // Get the first category.
      return [
        Meteor.subscribe('thread', this.params._id),
        Meteor.subscribe('threadMessages', this.params._id),
        Meteor.subscribe('threadUsers', this.params._id)
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
        Meteor.subscribe('threadMessages', this.params._id),
        Meteor.subscribe('threadUsers', this.params._id)
      ];
    },
    data: function() {
      return Threads.findOne(this.params._id);
    },
    controller: ThreadsController
  });
});
