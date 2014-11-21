$.fn.enable = function() {
  this.removeClass('disabled').removeProp('disabled');
  return this;
}

$.fn.disable = function() {
  this.addClass('disabled').prop('disabled', 'disabled');
  return this;
}
