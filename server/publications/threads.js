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

// TODO - as the volume of messages gets larger, this will get very slow.
Meteor.publish('privateThreadMessages', function(threadId) {
  if (this.userId) {
    return Messages.find({ threadId: threadId });
  }
  return [];
});

// Return the private threads that a user has.
Meteor.publish('userPrivateThreads', function() {
  if (this.userId) {
    return Threads.find({ memberIds: this.userId, isPrivate: true });
  }
  return [];
});

Meteor.publish('lastMessagesInThreads', function(threadIds) {
  if (this.userId) {
    var messages = Messages.find({ threadId: { $in: threadIds }});

    // We found the messages. Now retrieve the last ones per thread.
    var messageCursors = [];
    _.each(threadIds, function(threadId) {
      var lastMessage = Messages.find({ threadId: threadId }, {
        sort: { createdAt: -1 }, limit: 1
      });
      messageCursors.push(lastMessage);
    });

    return messageCursors;
  }
  return [];
});
