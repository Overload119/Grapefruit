Template.discussListItem.helpers({
  lastThreadMessage: function() {
    if (this.lastActiveMessage && this.lastActiveMessage.content) {
      return this.lastActiveMessage.content;
    } else {
      return 'This chat is empty.';
    }
  },
  lastThreadActiveDate: function() {
    return this.lastActiveAt;
  },
  threadThumbnail: function() {
    var pictureUrl = '/img/default_profile.png';
    if (this.creator) {
      pictureUrl = this.creator.largePictureUrl || this.creator.pictureUrl;
    }
    return 'background-image: url(\'' + pictureUrl + '\')';
  },
  threadTitle: function() {
    return this.title;
  },
});
