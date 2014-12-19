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

calculateEventTimes = function() {
  // Event times just dynamically calculates times, from 1:00am to 12:00pm

  var hours   = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  var minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  var merid   = ['am', 'pm'];
  var result  = [];

  _.each(hours, function(hr) {
    _.each(minutes, function(min) {
      _.each(merid, function(mrd) {
        result.push(hr + ':' + min + ' ' + mrd);
      });
    });
  });

  return result;
}
