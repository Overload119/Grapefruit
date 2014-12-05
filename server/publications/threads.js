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

Meteor.publish('privateThreadMessages', function(threadId, limit) {
  if (this.userId) {
    if (!limit) {
      limit = Constants.DEFAULT_MESSAGES_LIMIT;
    }

    return Messages.find({ threadId: threadId }, {
      sort: { createdAt: -1 }, limit: limit
    });
  }
  return [];
});

Meteor.publish('privateThreadUsers', function(threadId, limit) {
  if (this.userId) {
    var userIds = _.pluck(Threads.findOne(threadId).memberIds);
    return Meteor.users.find({ _id: { $in: userIds } }, { fields: Constants.PUBLIC_USER_FIELDS });
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
