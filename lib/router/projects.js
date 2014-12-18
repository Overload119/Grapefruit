ProjectsController = FastRender.RouteController.extend({
  layoutTemplate: 'layout'
});

Meteor.startup(function() {
  Router.route('/projects/new', {
    name: 'projectsNew',
    template: 'projectsNew',
    waitOn: function() {
      return [
        coreSubscriptions.subscribe('keywords', {})
      ];
    },
    controller: ProjectsController
  });

  Router.route('/projects/:_id', {
    name: 'projectsShow',
    template: 'projectsShow',
    data: function() {
      return Projects.findOne(this.params._id);
    },
    waitOn: function() {
      return [
        Meteor.subscribe('projectWithUsers', this.params._id)
      ];
    },
    controller: ProjectsController
  });

  Router.route('/projects', {
    name: 'projectsIndex',
    template: 'projectsIndex',
    waitOn: function() {
      return Meteor.subscribe('projects', {},
        { limit: Constants.DEFAULT_LIMIT + 1 });
    },
    controller: ProjectsController
  });
});
