Template.projectsIndex.helpers({
  activeIfSort: function(sort) {
    if (Session.get('pi_sort') === sort) {
      return 'active';
    }
    return '';
  },
  projects: function() {
    return Projects.find({}).fetch();
  }
});

Template.projectsIndex.created = function() {
  Session.set('pageTitle', 'Projects');
}
