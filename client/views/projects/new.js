Template.projectsNew.events({
  'click #project-create-btn': function(evt, template) {
    var projectTitle    = $('#project-title').val();
    var projectTagline  = $('#project-tagline').val();
    var projectContents = $('#project-contents').val();
    var projectTags     = $('#project-tags').val().split(',');

    if (!projectTitle.trim()) {
      $('#project-title').notify('This field is required.', { position: 'top left' })
      return;
    }

    if (!projectContents.trim()) {
      $('#project-contents').notify('This field is required.', { position: 'top left' })
      return;
    }

    Meteor.call('createProject', {
      title: projectTitle,
      tagline: projectTagline,
      tags: projectTags,
      content: projectContents
    }, function(err, result) {
      if (!err) {
        Router.go('projectsShow', { _id: result._id });
      }
    });
  }
});

Template.projectsNew.rendered = function() {
  var validKeywords = Keywords.find({ type: { $in: ['skills', 'interests'] }}).fetch();

  $('#project-tags').tagit({
    autocomplete: { minLength: 2 },
    placeholderText: 'Add tag...',
    allowSpaces: true,
    tagLimit: 5,
    caseSensitive: false,
    availableTags: _.pluck(validKeywords, 'content')
  });
};

Template.threadsNew.created = function() {
  Session.set('pageTitle', 'List Your Project');
};
