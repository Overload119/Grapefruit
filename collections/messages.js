Messages = new Meteor.Collection("messages");

MessageSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  createdAt: { type: Date, defaultValue: new Date() },
  content: { type: String },
  fromId: { type: String },
  threadId: {
    type: String,
    optional: false
  },
  read: { type: Boolean, defaultValue: false }
});

Messages.attachSchema(MessageSchema);
