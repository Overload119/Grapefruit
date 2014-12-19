EventsController = FastRender.RouteController.extend({
  layoutTemplate: 'layout'
});

Meteor.startup(function() {
  Router.route('/events/new', {
    name: 'eventsNew',
    template: 'eventsNew',
    controller: EventsController
  });

  Router.route('/events/:_id', {
    name: 'eventsShow',
    template: 'eventsShow',
    data: function() {
      return Events.findOne(this.params._id);
    },
    controller: EventsController
  });

  Router.route('/events', {
    name: 'eventsIndex',
    template: 'eventsIndex',
    data: function() {
      return Events.find({});
    },
    waitOn: function() {
      return [
        Meteor.subscribe('events')
      ]
    },
    controller: EventsController
  });
});
