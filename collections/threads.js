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
  creator: {
    type: Object,
    optional: true,
    blackbox: true
  },
  creatorId: {
    type: String,
    optional: false
  },
  isPrivate: {
    type: Boolean,
    defaultValue: false
  },
  title: {
    type: String,
    optional: true
  },
  memberIds: {
    type: [String],
    defaultValue: []
  },
  messageCount: {
    type: Number,
    defaultValue: 0
  },
  category: {
    type: String,
    optional: true
  },
  tags: {
    type: [String],
    optional: true,
    defaultValue: []
  },
  lastActiveUser: {
    type: Object,
    blackbox: true,
    optional: true
  },
  lastActiveMessage: {
    type: Object,
    optional: true,
    blackbox: true
  },
  lastActiveAt: {
    type: Date,
    defaultValue: new Date()
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

      var messageId = Messages.insert({
        fromId: this.userId,
        threadId: threadId,
        content: message,
        createdAt: new Date()
      });

      // Build short references to the thread of the last poster and the last message.
      var lastMessage = {
        _id: messageId,
        content: message
      }

      var lastUser = {
        _id: Meteor.userId(),
        largePictureUrl: Meteor.user().largePictureUrl,
        pictureUrl: Meteor.user().pictureUrl,
        firstName: Meteor.user().firstName,
        lastName: Meteor.user().lastName
      }

      Threads.update({ _id: thread._id }, {
        $inc: { messageCount: 1 },
        $addToSet: { memberIds: this.userId },
        $set: {
          lastActiveUser: lastUser,
          lastActiveMessage: lastMessage,
          lastActiveAt: new Date()
        }
      });

      // After a message is sent, possibly subscribe the user to the thread.
      if (Meteor.user().autoSubscribe) {
        Meteor.users.update({ _id: this.userId }, {
          $addToSet: { subscribedThreadIds: threadId }
        });
      }

      if (thread.isPrivate && !_.contains(thread.memberIds, this.userId)) {
        throw new Meteor.Error('You cannot send messages to this thread');
      }

      return true;
    } else {
      throw new Meteor.Error('That thread does not exist');
    }

    return false;
  },
  startThread: function(threadData) {
    check(threadData, Object);
    check(threadData.content, String);
    check(threadData.tags, Array);
    check(threadData.title, String);

    if (!this.userId) {
      throw new Meteor.Error('You need to be logged in for that.');
    }

    // Shallow reference to the thread creator.
    var creator = {
      _id: this.userId,
      largePictureUrl: Meteor.user().largePictureUrl,
      pictureUrl: Meteor.user().pictureUrl,
      firstName: Meteor.user().firstName,
      lastName: Meteor.user().lastName
    };

    var threadHasMessage = !!threadData.content.trim();

    var newThreadId = Threads.insert({
      creatorId: this.userId,
      creator: creator,
      messageCount: threadHasMessage ? 1 : 0,
      isPrivate: false,
      tags: threadData.tags,
      memberIds: [ this.userId ],
      title: threadData.title,
    });

    // The content of the thread is the first message.
    var msgId;
    if (threadHasMessage) {
      msgId = Messages.insert({
        fromId: this.userId,
        threadId: newThreadId,
        content: threadData.content,
        createdAt: new Date()
      });
    }

    // Update the thread after the message is created to give the.
    Threads.update({ _id: newThreadId }, {
      $set: {
        lastActiveUser: creator,
        lastActiveMessage: (threadHasMessage ? { _id: msgId, content: threadData.content } : {}),
        lastActiveAt: new Date()
      }
    });

    return Threads.findOne(newThreadId);
  },
  startOrContinueThreadWithUser: function(recipientId) {
    check(recipientId, String);

    if (!this.userId) {
      throw new Meteor.Error('You need to be logged in for that.');
    }

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
        memberIds: [recipientId, this.userId],
      });

      return Threads.findOne({ _id: newThreadId });
    }

    return false;
  }
});
