Template.threadsShow.helpers({
  messages: function() {
    // Sort by ASC first, so the last element is the most recent.
    var messages = Messages.find({ threadId: this._id }, {
      sort: { createdAt: -1 }, limit: Session.get('messageLimit')
    }).fetch();

    // Get the latest messages, but sort them ASC to render correctly.
    return _.sortBy(messages, function(message) { return message.createdAt });
  },
  isChatEmpty: function(thread) {
    if (thread.messageCount && thread.messageCount > 0) {
      return false;
    }
    return true;
  }
});

Template.threadsShow.events({
  'keyup .message-content': function(event, template) {
    // Enter is a shortcut to send a message.
    if (event.keyCode === 13) {
      $('.send-message').click();
    }
  },
  'click .send-message': function(event, template) {
    var messageContent = stripHtml($('.message-content').val());
    Meteor.call('sendMessageToThread', template.data._id, messageContent);
    $('.message-content').val('');
  }
});

Template.threadsShow.created = function() {
  Session.setDefault('messageLimit', 30);
}
