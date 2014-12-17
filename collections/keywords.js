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
  type: {
    type: String,
    optional: true
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
    if (Meteor.isServer) {
      // We track the number of times a keyword is used in search.
      Keywords.update({ _id: keyword._id, $inc: { frequency: 1 }});
    }
  },
  removeKeyword: function(keyword) {
    if (Meteor.isServer) {
      var keyword = Keywords.findOne({ content: keyword });
      if (keyword.count > 1) {
        Keywords.update({ _id: keyword._id }, { $inc: { frequency: -1 } });
      } else {
        // If reducing the frequency would bring it to 0 to less, we actually just want
        // to remove the keyword.
        Keywords.remove({ _id: keyword._id });
      }
    }
  },
  insertOrUpdateKeyword: function(keyword, type) {
    if (Meteor.isServer) {
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
        Keywords.insert({ content: keyword, type: type, count: 1 });
      }
    }
  }
});

Keywords.attachSchema(KeywordsSchema);
