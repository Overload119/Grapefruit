Template.threadsInboxShow.helpers({
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
    var recipient = Meteor.users.findOne(recipientIdInPrivateThread(this));
    var recipientImage = recipient && recipient.pictureUrl ?
                         recipient.pictureUrl : '/img/default_profile.png';

    return 'background-image: url(\'' + recipientImage + '\')';
  },
  threadTitle: function() {
    // Search through the member ids and get the other user.
    var recipientUser = Meteor.users.findOne(recipientIdInPrivateThread(this));
    if (recipientUser) {
      return 'Chat with ' +  recipientUser.firstName;
    } else {
      return 'Chat with ?';
    }
  },
});

Template.threadsInboxShow.created = function() {
};
