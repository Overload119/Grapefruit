Meteor.publish('thread', function(threadId) {
  if (this.userId) {
    return Threads.find({
      _id: threadId
    })
  }
  return [];
});

Meteor.publish('discussions', function(threadCriteria, threadOptions) {
  check(threadCriteria, Object);
  check(threadOptions, Object);

  if (this.userId) {
    return Threads.find(threadCriteria, threadOptions);
  }

  return [];
});

Meteor.publish('threads', function(limit) {
  // Always publish 1 more than the limit.
  // This will allow us to "Show More."
  if (this.userId) {
    return Threads.find({ isPrivate: false, messageCount: { $gt: 0 }}, {
      sort: { lastActiveAt: -1 }, limit: (limit || Constants.DEFAULT_LIMIT) + 1
    });
  }
  return [];
});

Meteor.publish('threadMessages', function(threadId, limit) {
  if (this.userId) {
    return Messages.find({ threadId: threadId }, {
      sort: { createdAt: -1 }, limit: limit || Constants.DEFAULT_MESSAGES_LIMIT
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

    return Meteor.users.find({ _id: { $in: thread.memberIds } },
      { fields: Constants.PUBLIC_USER_FIELDS });
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

// A composite gathering of a thread.
Meteor.publishComposite('threadWithUsers', function(threadId) {
  return {
    find: function() {
      return Threads.find({ _id: threadId }, { limit: 1 });
    },
    children: [
      {
        find: function(thread) {
          return Meteor.users.find({ _id: { $in: thread.memberIds } },
            { fields: Constants.PUBLIC_USER_FIELDS });
        }
      }
    ]
  }
});
