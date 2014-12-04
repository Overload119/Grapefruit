$.fn.enable = function() {
  this.removeClass('disabled').removeProp('disabled');
  return this;
};

$.fn.disable = function() {
  this.addClass('disabled').prop('disabled', 'disabled');
  return this;
};

$.fn.scrollToBottom = function(duration) {
  if (!this[0]) {
    throw new Error('scrollToBottom called with no element.');
  }

  if (duration) {
    this.animate({
      scrollTop: this[0].scrollHeight
    }, duration);
  } else {
    this.scrollTop( this[0].scrollHeight );
  }
  return this;
};
