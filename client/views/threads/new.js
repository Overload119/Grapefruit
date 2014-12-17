Template.threadsNew.helpers({
});

Template.threadsNew.events({
  'click #thread-create-btn': function(evt, template) {
    var firstMessageContent;
    var threadTitle = $('#thread-title').val();
    var threadContents = $('#thread-contents').val();
    var threadTags = $('#thread-tags').val().split(',');

    if (!threadTitle.trim()) {
      $('#thread-title').notify('This field is required.', { position: 'top left' });
      return;
    }

    Meteor.call('startThread', {
      title: threadTitle,
      content: threadContents,
      tags: threadTags
    }, function(err, result) {
      if (!err) {
        Router.go('discussShow', { _id: result._id });
      }
    });
  }
});


Template.threadsNew.rendered = function() {
  var validKeywords = Keywords.find({ type: { $in: ['skills', 'interests'] }}).fetch();

  $('#thread-tags').tagit({
    autocomplete: { minLength: 2 },
    placeholderText: 'Add tag...',
    allowSpaces: true,
    tagLimit: 5,
    caseSensitive: false,
    availableTags: _.pluck(validKeywords, 'content')
  });
};

Template.threadsNew.created = function() {
  Session.set('pageTitle', 'Create a Discussion');
};
