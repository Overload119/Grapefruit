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

  // If a messages is newly rendered, push down the chat screen to show it.
  // Only do this if the scrolling is relatively close to the bottom
  // (Avoid if user was scrolling previous messages)
  var scrollTop = this.firstNode.parentElement.scrollTop;
  var elementHeight = this.firstNode.parentElement.offsetHeight;

  var relativeScrollPos = (scrollTop / elementHeight);
  if (relativeScrollPos > 0.6) {
    this.firstNode.parentElement.scrollTop =
      this.firstNode.parentElement.scrollHeight;
  }

  Meteor.defer(function() {
    $(this.firstNode).removeClass('loading');
  }.bind(this));
};
