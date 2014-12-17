Meteor.publish('keywords', function(findCriteria) {
  return Keywords.find(findCriteria);
});
