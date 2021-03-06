Template.discussShow.helpers({
  isSubscribed: function() {
    return _.contains(Meteor.user().subscribedThreadIds, this._id);
  },
  numberOfDiscussionMembers: function() {
    return Meteor.users.find({ _id: { $in: thread.memberIds } }).count();
  },
  discussionMembers: function() {
    return Meteor.users.find({ _id: { $in: thread.memberIds } });
  },
  messages: function() {
    // Sort by ASC first, so the last element is the most recent.
    var messages = Messages.find({ threadId: this._id }, {
      sort: { createdAt: -1 }, limit: Session.get('ds_messageLimit')
    }).fetch();

    this.messageCount = messages.length;

    // Get the latest messages, but sort them ASC to render correctly.
    return _.sortBy(messages, function(message) { return message.createdAt });
  },
  moreMessagesLoading: function() {
    return Session.get('ds_moreMessagesLoading');
  },
  hasMoreMessages: function() {
    return this.messageCount > Session.get('ds_messageLimit');
  },
  isChatEmpty: function() {
    return this.messageCount === 0;
  }
});

Template.discussShow.events({
  'click #more-message-btn': function(evt, template) {
    var oldMessageLimit = Session.get('ds_messageLimit');
    Session.set('ds_messageLimit', oldMessageLimit + Constants.DEFAULT_MESSAGES_LIMIT);

    // Subscribe to more messages!
    Meteor.subscribe('threadMessages', template.data._id, Session.get('ds_messageLimit'),
      function onReady() {
        Session.set('ds_moreMessagesLoading', false);
      });
  },
  'keydown .message-content': function(event, template) {
    // ⌘+Enter is the shortcut in this case.
    var enterIsPressed = event.keyCode === 13;
    var metaIsPressed  = event.metaKey || event.ctrlKey;

    if (enterIsPressed && metaIsPressed) {
      $('.send-message').click();
    }
  },
  'change #subscribeToggle': function(evt, template) {
    var subscribe = $(evt.currentTarget).is(':checked');

    if (subscribe) {
      Meteor.users.update({ _id: Meteor.userId() }, {
        $addToSet: { subscribedThreadIds: this._id }
      });
    } else {
      Meteor.users.update({ _id: Meteor.userId() }, {
        $pull: { subscribedThreadIds: this._id }
      });
    }
  },
  'click .send-message': function(event, template) {
    var messageContent = stripHtml($('.message-content').val());
    var subscribe      = $('.subscribe input').is(':checked');

    if (!messageContent) {
      return;
    }

    $('.message-content').val('');
    Meteor.call('sendMessageToThread', template.data._id, messageContent);
  }
});

Template.discussShow.created = function() {
  this.messageCount = 0;
  Session.setDefault('ds_messageLimit', Constants.DEFAULT_MESSAGES_LIMIT);
  Session.setDefault('ds_moreMessagesLoading', false);
}

Template.discussShow.rendered = function() {
  // Scroll the chat to the bottom.
  this.find('.discuss-chat-screen').scrollTop =
    this.find('.discuss-chat-screen').scrollHeight;
};
