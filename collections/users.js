var Schema = {};

Schema.User = new SimpleSchema({
  _id: {
    type: String,
    optional: false
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    defaultValue: false,
  },
  createdAt: { type: Date },
  twitterUrl: {
    type: String,
    optional: true
  },
  linkedInUrl: { type: String },
  skills: {
    type: [String]
  },
  listedAs: {
    type: [String],
    defaultValue: []
  },
  lookingFor: {
    type: [String],
    defaultValue: []
  },
  interests: {
    type: [String]
  },
  headline: { type: String },
  jobExperience: {
    type: [String],
    defaultValue: []
  },
  email: {
    type: String ,
    regEx: SimpleSchema.RegEx.Email,
    unique: true,
  },
  pictureUrl: { type: String },
  location: {
    type: [Number],
    index: '2d',
    optional: true
  },
  isHidden: { type: Boolean, defaultValue: false },
  numVotesReceived: {
    type: Number,
    defaultValue: 0
  },
  numVotesCast: {
    type: Number,
    defaultValue: 0
  },
  lastActiveAt: {
    type: Date,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

Meteor.users.attachSchema(Schema.User);
