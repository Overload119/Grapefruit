var FastRender = { RouteController: RouteController, onAllRoutes: function() {} };

Router.configure({
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
  cacheLimit: 10, // # subscriptions to keep (not number of entries in each).
  expireIn: 60 // Time to live (minutes)
});

if (Meteor.isServer) {
  FastRender.onAllRoutes(function() {
    this.subscribe('currentUserProfile');
  });
};
