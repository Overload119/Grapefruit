Meteor.startup(function() {
  if (Meteor.isClient) {
    Session.setDefault('pageTitle', 'Home');

    // The default tab on the project index page is most popular.
    Session.setDefault('pi_sort', 'popular');
    Session.setDefault('ti_sort', 'active');
  }

  // When logged in, default by rendering the Community page.
  // The UsersController will handle what to do if a user is not logged in.
  Router.route('/', {
    name: 'dashboard',
    template: 'threadsIndex',
    waitOn: function() {
      return coreSubscriptions.subscribe('keywords', {});
    },
    controller: UsersController
  });

  if (Meteor.isClient) {
    Router.onAfterAction(function() {
      document.title = Session.get('pageTitle') + ' | ' + Meteor.settings.public.appName;
    });
  }
});
