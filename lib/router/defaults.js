Meteor.startup(function() {

  if (Meteor.isClient) {
    Session.setDefault('pageTitle', 'Home');
  }

  // Only the frontpage can be accessed without logging in.
  Router.onBeforeAction(function() {
    if (Meteor.user()) {
      this.next();
    } else {
      this.layout('staticLayout');
      this.render('frontpage');
    }
  });

  // When logged in, default by rendering the Community page.
  Router.route('/', {
    name: 'dashboard',
    template: 'threadsIndex',
    waitOn: function() {
      return coreSubscriptions.subscribe('keywords');
    },
    controller: UsersController
  });

  if (Meteor.isClient) {
    Router.onAfterAction(function() {
      document.title = Meteor.settings.public.appName + ' | ' + Session.get('pageTitle');
    });
  }
});
