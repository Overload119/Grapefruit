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
    check(searchParams.searchType, String);

    var userId = this.userId;
    if (!userId) {
      throw new Meteor.Error('User is not logged in');
    }

    if (!searchParams.term) {
      throw new Meteor.Error('Search parameters did not contain `term`.');
    }

    searchParams.term = searchParams.term.toLowerCase();

    var searchResult;
    switch (searchParams.searchType) {
      case 'geo':
        check(searchParams.lat, Number);
        check(searchParams.lng, Number);
        var asyncDbLookup = function(callback) {
          _db.command({
            geoNear: 'users',
            near: [searchParams.lat, searchParams.lng],
            limit: 30,
            query: {
              _id: { $ne: userId }, //ignore the searcher.
              $or: [
                { interests: searchParams.term },
                { skills: searchParams.term },
                { jobExperience: searchParams.term },
                { listedAs: searchParams.term }
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
        searchResult = syncDbLookup();
        break;
      case 'users_in_thread':
        check(searchParams.threadId, String);

        searchResult = Meteor.users.find({
          threadIds: searchParams.threadId,
          $or: [
            { interests: searchParams.term },
            { skills: searchParams.term },
            { jobExperience: searchParams.term },
            { listedAs: searchParams.term }
          ]
        }, { limit: 30 }).fetch();
        break;
      default:
        throw new Meteor.Error('Unrecognized search type: ' + searchParams.searchType);
        break;
    }

    return searchResult;
  }
});
