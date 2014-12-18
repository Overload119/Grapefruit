Template.projectListItem.helpers({
  projectThumbnail: function() {
    var src;
    if (this.picture) {
      src = this.picture;
    }
    else {
      var projectCreator = Meteor.users.findOne( this.creatorId );
      src = projectCreator.largePictureUrl || projectCreator.pictureUrl;
      // Last fallback, default image.
      // TODO Have a default project image.
      if (!src) {
        src = '/img/default_profile.png'
      }
    }
    return 'background-image: url(\'' + src + '\')';
  }
});
