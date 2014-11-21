Messages = new Meteor.Collection("messages");

MessageSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: false
  },
  createdAt: { type: Date },
  content: { type: String },
  fromId: { type: String },
  toId: { type: String },
});

Messages.attachSchema(MessageSchema);
