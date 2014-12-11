var FastRender = { RouteController: RouteController, onAllRoutes: function() {} };

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [
      Meteor.subscribe('currentUserProfile')
    ];
  }
});

Router.onBeforeAction('dataNotFound');

coreSubscriptions = new SubsManager({
  // cache recent 50 subscriptions
  cacheLimit: 10,
  // expire any subscription after 30 minutes
  expireIn: 60
});

if (Meteor.isServer) {
  FastRender.onAllRoutes(function() {
    this.subscribe('currentUserProfile');
  });
};
