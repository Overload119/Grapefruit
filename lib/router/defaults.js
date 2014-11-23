Meteor.startup(function() {
  Router.onBeforeAction(function() {
    // Only the frontpage can be accessed without logging in.
    if (Meteor.user()) {
      this.next();
    } else {
      Session.set('shouldShowNav', false);
      this.render('frontpage');
    }
  });

  Router.onAfterAction(function() {
    // TODO make this dynamic.
    document.title = 'OrangePeel';
  });
});
