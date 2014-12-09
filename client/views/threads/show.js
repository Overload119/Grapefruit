Template.threadsShow.helpers({
  messages: function() {
    // Sort by ASC first, so the last element is the most recent.
    var messages = Messages.find({ threadId: this._id }, {
      sort: { createdAt: -1 }, limit: Session.get('messageLimit')
    }).fetch();

    this.messageCount = messages.length;

    // Get the latest messages, but sort them ASC to render correctly.
    return _.sortBy(messages, function(message) { return message.createdAt });
  },
  moreMessagesLoading: function() {
    return Session.get('moreMessagesLoading');
  },
  hasMoreMessages: function() {
    return this.messageCount > Session.get('messageLimit');
  },
  isChatEmpty: function() {
    return this.messageCount === 0;
  }
});

Template.threadsShow.events({
  'click #more-message-btn': function(evt, template) {
    var oldMessageLimit = Session.get('messageLimit');
    Session.set('messageLimit', oldMessageLimit + Constants.DEFAULT_MESSAGES_LIMIT);

    // Subscribe to more messages!
    Meteor.subscribe('privateThreadMessages', template.data._id, Session.get('messageLimit'),
      function onReady() {
        Session.set('moreMessagesLoading', false);
      });
  },
  'keyup .message-content': function(event, template) {
    // Enter is a shortcut to send a message.
    if (event.keyCode === 13) {
      $('.send-message').click();
    }
  },
  'click .send-message': function(event, template) {
    var messageContent = stripHtml($('.message-content').val());
    $('.message-content').val('');
    Meteor.call('sendMessageToThread', template.data._id, messageContent);
  }
});

Template.threadsShow.created = function() {
  this.messageCount = 0;
  Session.setDefault('messageLimit', Constants.DEFAULT_MESSAGES_LIMIT);
  Session.setDefault('messages', []);
  Session.setDefault('moreMessagesLoading', false);
}

Template.threadsShow.rendered = function() {
  // Scroll the chat to the bottom.
  this.find('.chat-screen').scrollTop =
    this.find('.chat-screen').scrollHeight;
};
