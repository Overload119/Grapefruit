debug_applyFixture = function() {
  var userCount = Meteor.users.find({}).count();
  // If there is only 1 person, we can duplicate by nudging its values.
  if (userCount === 1) {
    var user = Meteor.users.findOne();
    for (var i = 0; i < 30; i++) {
      var lat = user.location[0];
      var lng = user.location[1];

      var nudgeValueLat = Math.random() * 0.4 - 0.2;
      var nudgeValueLng = Math.random() * 0.4 - 0.2;

      user._id = Random.id();
      user.services = {};
      user.email = 'budgeneration+' + i + '@gmail.com';
      user.location = [ lat + nudgeValueLat, lng + nudgeValueLng ];

      Meteor.users.insert(user);
    }
  }
}

Meteor.startup(function() {
  debug_applyFixture();
});
