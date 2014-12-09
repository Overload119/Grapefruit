Meteor.publish('thread', function(threadId) {
  if (this.userId) {
    return Threads.find({
      _id: threadId
    })
  }
  return [];
});

Meteor.publish('discussions', function(category, limit) {
  if (this.userId) {
    return Threads.find({ category: category }, {
      sort: { lastActiveAt: -1 }, limit: (limit || Constants.DEFAULT_LIMIT)
    });
  }
  return [];
});

Meteor.publish('threads', function(limit) {
  if (this.userId) {
    return Threads.find({ isPrivate: false, messageCount: { $gt: 0 }}, {
      sort: { lastActiveAt: -1 }, limit: (limit || Constants.DEFAULT_LIMIT)
    });
  }
  return [];
});

Meteor.publish('threadMessages', function(threadId, limit) {
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

Meteor.publish('threadUsers', function(threadId, limit) {
  if (this.userId) {
    var thread = Threads.findOne(threadId);

    if (!thread) {
      return [];
    }

    var userIds = _.pluck(thread.memberIds);
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
