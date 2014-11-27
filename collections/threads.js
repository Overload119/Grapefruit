Threads = new Meteor.Collection('threads');

ThreadsSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    defaultValue: new Date()
  },
  creatorId: {
    type: String,
    optional: false
  },
  isPrivate: {
    type: Boolean,
    defaultValue: false
  },
  memberIds: {
    type: [String],
    defaultValue: []
  },
  messageCount: {
    type: Number,
    defaultValue: 0
  }
});

Threads.attachSchema(ThreadsSchema);

Meteor.methods({
  currentUserInbox: function() {
    // Constructs an array of Inbox items.
    // An Inbox item is an object that contains:
    // { user: { name, image }, thread: { _id }, lastMessageContent: {} }

    if (!this.userId)
      throw new Meteor.Error('You must be logged in to do that.');

    var threads = Threads.find({ memberId: this.userId, isPrivate: true }).fetch();
    var results = [];

    // For each thread, find the last message and the recipient.
    _.each(threads, function(thread) {

      var entry = {};

      // It's possible that a thread was created but has no messages.
      var lastMessage = Messages.find({ threadId: thread.id }, {
        sort: { createdAt: -1 }, limit: 1
      }).fetch();

      if (lastMessage) {
        entry.lastMessageContent = lastMessage.content;
      }

      entry.thread = thread;

      var recipientId = _.without(thread.memberIds, this.userId)[0];

      if (recipientId) {
        user = Users.findOne(recipientId, { fields: Constants.PUBLIC_USER_FIELDS });
        entry.user = user;
      }

      results.push(entry);

    }.bind(this));

    return results;
  },
  sendMessageToThread: function(threadId, message) {
    check(threadId, String);
    check(message, String);

    message = stripHtml(message);

    if (!this.userId)
      throw new Meteor.Error('You must be logged in to do that.');

    if(!message)
      throw new Meteor.Error('That message is empty.');

    var thread = Threads.findOne(threadId);
    if (thread) {

      Threads.update({ _id: thread._id }, {
        $inc: { messageCount: 1 }
      });

      if (thread.isPrivate && !_.contains(thread.memberIds, this.userId)) {
        throw new Meteor.Error('You cannot send messages to this thread');
      }

      Messages.insert({
        fromId: this.userId,
        threadId: threadId,
        content: message,
        createdAt: new Date()
      });

      return true;
    } else {
      throw new Meteor.Error('That thread does not exist');
    }

    return false;
  },
  startOrContinueThreadWithUser: function(recipientId) {
    check(recipientId, String);

    var recipient = Meteor.users.findOne(recipientId);
    var existingThread = Threads.findOne({
      isPrivate: true,
      memberIds: { $all: [recipientId, this.userId], $size: 2 }
    });

    if (existingThread) {
      return existingThread;
    }

    if (recipient) {
      var newThreadId = Threads.insert({
        creatorId: this.userId,
        isPrivate: true,
        memberIds: [recipientId, this.userId]
      });

      return Threads.findOne({ _id: newThreadId });
    }

    return false;
  }
});
