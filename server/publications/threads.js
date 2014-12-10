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
