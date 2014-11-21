Meteor.methods({
  completeTutorial: function(newFields) {
    if (this.userId) {
      Meteor.users.update({ _id: this.userId }, { $set: newFields });
    }
  },
  updateCurrentUserLocation: function(latitude, longitude) {
    if (this.userId) {
      Meteor.users.update({ _id: this.userId }, {
        $set: {
          location: [latitude, longitude]
        }
      });
    }
  }
});
