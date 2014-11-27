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
    // We found the messages. Now retrieve the last ones per thread.
    var lastMessageIds = [];
    var messageCursors = [];
    _.each(threadIds, function(threadId) {
      var lastMessage = Messages.findOne({ threadId: threadId }, {
        sort: { createdAt: -1 }, limit: 1
      });

      if (lastMessage) {
        lastMessageIds.push(lastMessage._id);
      }
    });

    return Messages.find({ _id: { $in: lastMessageIds }});
  }
  return [];
});
