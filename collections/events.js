Events = new Meteor.Collection('events');

EventsSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    defaultValue: new Date()
  },
  updatedAt: {
    type: Date,
  },
  startDate: {
    type: Date,
    optional: false
  },
  endDate: {
    type: Date,
    optional: true
  },
  description: {
    type: String,
    optional: false
  },
  title: {
    type: String,
    optional: false
  },
  attendeeIds: {
    type: [String],
    optional: false,
    defaultValue: []
  },
  creator: {
    type: Object,
    blackbox: true,
    optional: false
  },
  location: {
    type: String,
    optional: false
  },
  isHidden: {
    type: Boolean,
    optional: false,
    defaultValue: false
  }
});

Events.attachSchema(EventsSchema);

Meteor.methods({
});
