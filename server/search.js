var _db, _users, MongoClient;

MongoClient = Meteor.npmRequire('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:3001/meteor', function(err, db) {
  if (err) {
    throw err;
  }
  _db = db; // make database handle available to Meteor.methods
})

Meteor.methods({
  searchQuery: function(searchParams, callback) {
    // Look through skills and work experience.
    // Sort by distance (using $near forces this).
    // Limit of 100 is also enforced by $near.
    // TODO Incorporate recently active
    check(searchParams, Object);

    if (!this.userId) {
      throw new Meteor.Error('User is not logged in');
    }

    if (!searchParams.term) {
      throw new Meteor.Error('Search parameters did not contain `term`.');
    }

    var asyncDbLookup = function(callback) {
      _db.command({
        geoNear: 'users',
        near: [searchParams.lat, searchParams.lng],
        limit: 30,
        query: {
          $or: [
            { interests: searchParams.term },
            { skills: searchParams.term },
            { jobExperience: searchParams.term }
          ]
        }
      }, function(err, res) {
        var results = [];

        // Pluck only the fields we want.
        if (res.results && res.results.length > 0) {
          results = _.map(res.results, function(entry) {
            var mappedEntry = _.pick(entry.obj, '_id', 'pictureUrl', 'headline', 'firstName');
            mappedEntry.distance = entry.dis;
            return mappedEntry
          });
        }

        callback(null, results);
      });
    };

    var syncDbLookup = Meteor.wrapAsync(asyncDbLookup);
    return syncDbLookup();
  }
});
