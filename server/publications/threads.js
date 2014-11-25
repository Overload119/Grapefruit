Meteor.publish('privateThread', function(threadId) {
  if (this.userId) {
    // Ensure that the user is part of the thread.
    // Also only look through private threads.
    return Threads.find({
      _id: threadId,
      isPrivate: true,
      memberIds: this.userId
    })
  }
  return [];
});

Meteor.publish('privateThreadMessages', function(threadId) {
  if (this.userId) {
    return Messages.find({ threadId: threadId });
  }
  return [];
});
