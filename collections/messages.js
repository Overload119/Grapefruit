Messages = new Meteor.Collection("messages");

MessageSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  createdAt: { type: Date, defaultValue: new Date() },
  content: { type: String },
  fromId: { type: String },
  isMarkdown: {
    type: Boolean,
    defaultValue: false
  },
  threadId: {
    type: String,
    optional: false
  },
  read: { type: Boolean, defaultValue: false }
});

Messages.attachSchema(MessageSchema);

Messages.after.insert(function(userId, doc) {
  // After a message is added, then add the threadId to the users threadIds.
  Meteor.users.update({ _id: userId }, {
    $addToSet: { threadIds: doc.threadId }
  });
});
