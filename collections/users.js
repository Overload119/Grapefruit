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
  createdAt: {
    type: Date,
    defaultValue: new Date()
  },
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
  headline: { type: String, optional: true },
  summary: { type: String, optional: true },
  jobExperience: {
    type: [String],
    defaultValue: []
  },
  email: {
    type: String ,
    regEx: SimpleSchema.RegEx.Email,
    unique: true,
  },
  pictureUrl: { type: String, optional: true },
  largePictureUrl: { type: String, optional: true },
  location: {
    type: [Number],
    decimal: true,
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
  threadIds: {
    type: [String],
    defaultValue: [],
    optional: false
  },
  subscribedThreadIds: {
    type: [String],
    defaultValue: [],
    optional: false
  },
  isTutorialComplete: {
    type: Boolean,
    defaultValue: false
  },
  isSubscribedToMsgNotif: {
    type: Boolean,
    defaultValue: true
  },
  isMessagable: {
    type: Boolean,
    defaultValue: true
  },
  autoSubscribe: {
    type: Boolean,
    defaultValue: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

Meteor.users.attachSchema(Schema.User);

Meteor.users.allow({
  update: function(userId, userProp, fieldNames, modifier) {
    // Remove from the fields names the protected fields.
    // If there is nothing left, then deny the update.
    if (userId === Meteor.userId()) {
      // Allow _.without to accept an array as an argument.
      var validFieldsToUpdate = _.without.apply(_, [fieldNames].concat(Constants.PROTECTED_USER_FIELDS));
      if (validFieldsToUpdate.length > 0) {
        return true;
      }
    }
    return false;
  }
});
