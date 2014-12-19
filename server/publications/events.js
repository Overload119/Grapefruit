Meteor.publish('events', function() {
  if (this.userId) {
    return Events.find({ isHidden: false }, {
      startDate: { $gte: (new Date()).valueOf() }
    });
  }
  return [];
});

Meteor.publish('event', function(eventId) {
  if (this.userId) {
    return Events.find({ _id: eventId }, { limit: 1 });
  }
  return [];
});
