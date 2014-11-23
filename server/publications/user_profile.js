Meteor.publish('userProfile', function(whichUserId) {
  if (this.userId) {
    return Meteor.users.find({ _id: whichUserId }, { fields: Constants.PUBLIC_USER_FIELDS });
  }
  return [];
});
