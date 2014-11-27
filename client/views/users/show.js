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
