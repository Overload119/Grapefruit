Meteor.publish('currentUserProfile', function() {
  return Meteor.users.find({ _id: this.userId });
});
