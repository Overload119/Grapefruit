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
  twitterUrl: { type: String },
  linkedInUrl: { type: String },
  skills: {
    type: [String]
  },
  listedAs: {
    type: [String]
  },
  interests: {
    type: [String]
  },
  headline: { type: String },
  jobExperience: { type: String },
  email: {
    type: String ,
    regEx: SimpleSchema.RegEx.Email,
    unique: true,
  },
  pictureUrl: { type: String },
  lookingFor: { type: [String] },
  location: {
    type: [Number],
    index: '2d',
  },
  isHidden: { type: Boolean },
  numVotesReceived: { type: Number, defaultValue: 0 },
  numVotesCast: { type: Number, defaultValue: 0 },
  lastActiveAt: { type: Date },
});

Meteor.users.attachSchema(Schema.User);
