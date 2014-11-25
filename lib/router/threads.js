MessagesController = FastRender.RouteController.extend({
});

Meteor.startup(function() {
  Router.route('/threads/to/:userId/:threadId', {
    name: 'threadsShow',
    waitOn: function() {
      return [
        Meteor.subscribe('privateThread', this.params.threadId),
        Meteor.subscribe('privateThreadMessages', this.params.threadId)
      ];
    },
    data: function() {
      return Threads.findOne(this.params.threadId);
    }
  });
});
