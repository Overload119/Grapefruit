Template.eventsIndex.events({
  'click #create-event': function(evt, template) {
    Router.go('eventsNew');
  }
});

Template.eventsIndex.helpers({
  eventsThisMonth: function() {
    var endOfThisMonth = moment().add(1, 'month').date(0).valueOf();
    return Events.find({
      startDate: {
        $gte: (new Date()).valueOf(),
        $lte: endOfThisMonth
      },
    }, {
      sort: { startDate: 1 }
    });
  },
  thisMonthName: function() {
    return moment().format('MMMM');
  },
  nextMonthName: function() {
    return moment().add(1, 'month').format('MMMM');
  },
  eventsNextMonth: function() {
    var startOfNextMonth  = moment().add(1, 'month').date(1).valueOf();
    var endOfNextMonth    = moment().add(2, 'months').date(-1).valueOf();
    return Events.find({
      startDate: {
        $gte: startOfNextMonth,
        $lte: endOfNextMonth
      },
    }, {
      sort: { startDate: 1 }
    });
  }
});
