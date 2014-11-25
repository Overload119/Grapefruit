Template.messagesBubble.helpers({
  messageClass: function() {
    if (Meteor.userId() === this.fromId) {
      return 'bubble-right';
    }
    return 'bubble-left';
  }
});

Template.messagesBubble.rendered = function() {
  var self = $(this.firstNode);
  // When a message is rendered, bring down the chat screen.
  this.firstNode.parentElement.scrollTop =
    this.firstNode.parentElement.scrollHeight;
  Meteor.defer(function() {
    $(this.firstNode).removeClass('loading');
  }.bind(this));
};
