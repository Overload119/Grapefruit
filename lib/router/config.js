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

if (Meteor.isServer) {
  FastRender.onAllRoutes(function() {
    this.subscribe('currentUserProfile');
  });
};
