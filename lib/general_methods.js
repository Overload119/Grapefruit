Meteor.methods({
  completeTutorial: function(newFields) {
    // A local way to keep track of tutorial completion.
    if (Meteor.isClient) {
      localStorage.setItem('isTutorialComplete', true);
    }

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
