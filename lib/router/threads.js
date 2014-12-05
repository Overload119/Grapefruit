ThreadsController = FastRender.RouteController.extend({
});

Meteor.startup(function() {
  Router.route('/threads/:_id', {
    name: 'threadsShow',
    template: 'threadsShow',
    waitOn: function() {
      return [
        Meteor.subscribe('privateThread', this.params._id),
        Meteor.subscribe('privateThreadMessages', this.params._id),
        Meteor.subscribe('privateThreadUsers', this.params_id)
      ];
    },
    data: function() {
      return Threads.findOne(this.params._id);
    },
    controller: ThreadsController
  });
});
