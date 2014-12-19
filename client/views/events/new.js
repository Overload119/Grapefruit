Template.eventsNew.events({
  'click #show-event-start-time': function(evt, template) {
    var el = $(evt.currentTarget);
    if (!!el.data('isShowing')) {
      // The element was showing, so we clear and hide it.
      el.removeData('isShowing');
      el.html('Add event time?');
      $('.tagit').hide();
      $('#event-start-time').data('ui-tagit').removeAll();
    } else {
      el.data('isShowing', true);
      el.html('Remove event time.');
      $('.tagit').show();
    }
  }
});

Template.eventsNew.helpers({

});

Template.eventsNew.rendered = function() {
  this.datePicker = new Pikaday({
    minDate: new Date(),
    field: document.getElementById('event-start-date'),
    format: 'MMMM Do YYYY'
  });

  $('#event-start-time').tagit({
    placeholderText: 'ex. 5:30 pm',
    allowSpaces: true,
    tagLimit: 1,
    caseSensitive: false,
    autocomplete: { delay: 0, minLength: 1, source: calculateEventTimes() },
    // Events
    afterTagAdded: function(event, ui) {
      var numTags = $(event.target).data('ui-tagit').tagList.length;
      if (numTags === 1)
        $(event.target).data('ui-tagit').tagInput.hide();
    },
    afterTagRemoved: function(event, ui) {
      var numTags = $(event.target).data('ui-tagit').tagList.length;
      $(event.target).data('ui-tagit').tagInput.show();
    }
  });
  $('.tagit').hide();
};

Template.eventsNew.created = function() {
  Session.set('pageTitle', 'New Event');
};

Template.eventsNew.destroyed = function() {
  this.datePicker.destroy();
};
