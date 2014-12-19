Template.eventsIndex.events({
  'click #create-event': function(evt, template) {
    Router.go('eventsNew');
  }
});
