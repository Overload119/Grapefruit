Keywords = new Meteor.Collection("keywords");

KeywordsSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  frequency: {
    type: Number,
    defaultValue: 0
  },
  count: {
    type: Number,
    defaultValue: 0,
  },
  content: {
    type: String,
    index: true,
    unique: true,
    optional: false
  }
});

Meteor.methods({
  increaseKeywordFrequency: function(keyword) {
    // We track the number of times a keyword is used in search.
    Keywords.update({ _id: keyword._id, $inc: { frequency: 1 }});
  },
  insertOrUpdateKeyword: function(keyword) {
    if (typeof keyword !== 'string') {
      throw new Meteor.Error('Keyword must be a string.');
    }

    if (keyword.trim() === '') {
      throw new Meteor.Error('Keyword must not be blank.');
    }

    var existingKeyword = Keywords.findOne({ content: keyword });
    if (existingKeyword) {
      Keywords.update({ _id: existingKeyword.id }, { $inc: {count: 1} });
    } else {
      Keywords.insert({ content: keyword });
    }
  }
});

Keywords.attachSchema(KeywordsSchema);
