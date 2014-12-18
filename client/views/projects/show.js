Template.projectsShow.events({
  'click #like-btn': function(evt, template) {
    var el = $(evt.currentTarget);
    el.disable();

    Meteor.call('toggleLikeOnProject', this._id, function(err, result) {
      if (!err) {
        el.enable();
      }
    });
  },
  'click #edit-project-description': function(evt, template) {
    var el = $(evt.currentTarget);

    if (!!el.data('editing')) {
      var projectContent = $('#edit-project-description-txt').val();

      // Update with the new description.
      Projects.update({ _id: this._id }, {
        $set: { content: projectContent }
      }, function(err, numDocs) {
        if (!err) {
          el.removeData('editing');

          $('#project-description').removeClass('hidden');
          $('#edit-project-description-txt').removeClass('active');

          el.find('i').removeClass('fa-save').addClass('fa-edit');
          el.find('span').html('Edit');
        } else {
          el.notify('An error occured saving the project.');
        }
      });

    } else {
      el.data('editing', true);

      // Enable UI to edit the project.
      var txtHeight = $('#project-description').height()
      $('#project-description').addClass('hidden');
      $('#edit-project-description-txt')
        .addClass('active')
        .val(this.content)
        .height(txtHeight);
      el.find('i').removeClass('fa-edit').addClass('fa-save');
      el.find('span').html('Save');
    }
  }
});

Template.projectsShow.helpers({
  hasLiked: function() {
    return _.contains(this.likerIds || [], Meteor.userId());
  },
  contentAsHtml: function() {
    return marked(this.content);
  },
  canEdit: function() {
    return Meteor.userId() === this.creatorId;
  }
});

Template.projectsShow.created = function() {
  Session.set('pageTitle', this.data.title);
};
