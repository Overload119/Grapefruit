Meteor.publish('currentUserProfile', function() {
  return Meteor.users.find({ _id: this.userId });
});

Meteor.publish('currentUserMessages', function() {
  return Messages.find({ toId: this.userId });
});
