ProjectsController = FastRender.RouteController.extend({
  layoutTemplate: 'layout'
});

Meteor.startup(function() {
  Router.route('/projects', {
    name: 'projectsIndex',
    template: 'projectsIndex',
    waitOn: function() {
      return Meteor.subscribe('projects', {});
    },
    controller: ProjectsController
  });
});
