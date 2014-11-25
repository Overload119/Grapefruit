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
