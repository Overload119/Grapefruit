Meteor.startup(function() {
  if (Meteor.isClient) {
    Session.setDefault('pageTitle', 'Home');

    // The default tab on the project index page is most popular.
    Session.setDefault('pi_sort', 'popular');
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
      document.title = Session.get('pageTitle') + ' | ' + Meteor.settings.public.appName;
    });
  }
});
