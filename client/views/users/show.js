Template.usersShow.helpers({
  userIsMessagable: function() {
    return Meteor.userId() !== this._id && this.isMessagable;
  },
  showSummaryOrPlaceholder: function(summaryText) {
    if (summaryText) {
      var textLines = summaryText.split('\n');
      return textLines.join('<br/>');
    } else {
      return this.firstName + ' has not filled out their profile yet.';
    }
  }
});

Template.usersShow.events({
  'click .send-message-cta': function(event, template) {
    Meteor.call('startOrContinueThreadWithUser', template.data._id, function(err, result) {
      // The result is a thread ID.
      Router.go('threadsShow', {
        _id: result._id
      });
    });
  }
});
