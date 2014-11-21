Meteor.startup(function() {
  Meteor.users._ensureIndex({ location: '2d' });
});
