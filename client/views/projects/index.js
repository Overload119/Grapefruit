var getProjectParameters = function (sort) {
  var projectCriteria = {};

  var projectOptions = {
    limit: Session.get('projectLimit'),
    sort: { lastActiveAt: -1 }
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
  'click .sort-bar button': function(evt, template) {
    var el = $(evt.currentTarget);
    var sortPref = el.data('value');

    Session.set('pi_sort', sortPref);
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
    return Projects.find({}).fetch();
  },
  hasMoreProjects: function() {
    var params = getProjectParameters(Session.get('pi_sort'));
    return Projects.find(param.projectCriteria, params.projectOptions).count() >
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
