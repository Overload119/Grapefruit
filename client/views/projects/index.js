var getProjectParameters = function (sort) {
  // TODO: Eventually we may want to add additional criteria like sorting by tags.
  var projectCriteria = {};

  var projectOptions = {
    sort: { createdAt: -1 },
    limit: Session.get('projectLimit')
  };

  switch (sort) {
    case 'popular':
      projectOptions.sort = { score: -1 };
      break;
    case 'active':
    default:
      break;
  };

  return {
    projectCriteria: projectCriteria,
    projectOptions: projectOptions
  };
};

Template.projectsIndex.events({
  'click #create-project': function(evt, template) {
    Router.go('projectsNew');
  },
  'click .sort-bar button': function(evt, template) {
    var el = $(evt.currentTarget);
    var sortPref = el.data('value');

    Session.set('pi_sort', sortPref);
  },
  'click .show-more-btn': function(evt, template) {
    var oldLimit = Session.get('projectLimit');
    Session.set('projectLimit', oldLimit + Constants.DEFAULT_LIMIT);
    Session.set('isLoadingProjects', true);
    var params = getProjectParameters(Session.get('pi_sort'));

    // Subscribe to the additional threads. +1 on limit so we can show Show More if necessary.
    params.projectOptions.limit++;
    Meteor.subscribe('projects', params.projectCriteria, params.projectOptions,
      function onReady() {
        Session.set('isLoadingProjects', false);
      });
  }
});

Template.projectsIndex.helpers({
  activeIfSort: function(sort) {
    if (Session.get('pi_sort') === sort) {
      return 'active';
    }
    return '';
  },
  projects: function() {
    var params = getProjectParameters(Session.get('pi_sort'));
    return Projects.find(params.projectCriteria, params.projectOptions);
  },
  hasMoreProjects: function() {
    var params = getProjectParameters(Session.get('pi_sort'));
    return Projects.find(params.projectCriteria).count() >
      Session.get('projectLimit');
  },
  isLoadingProjects: function() {
    return Session.get('isLoadingProjects');
  }
});

Template.projectsIndex.created = function() {
  Session.set('pageTitle', 'Projects');
  Session.set('projectLimit', Constants.DEFAULT_LIMIT);
  Session.set('isLoadingProjects', false);
}
