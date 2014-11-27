UsersController = FastRender.RouteController.extend({
  waitOn: function() {
    return Meteor.subscribe('currentUserProfile');
  },
  onBeforeAction: function() {
    // Ensure that the user finishes the tutorial before using their dashboard.
    // Checking isTutorialComplete takes a second.
    if (!!Meteor.user() && !Meteor.user().isTutorialComplete) {
      Session.set('shouldShowNav', false);
      this.render('usersTutorial');
    } else if (Meteor.user()) {
      Session.set('shouldShowNav', true);
      this.next();
    }
  }
});

Meteor.startup(function() {
  // By default '/' goes to search.
  Router.route('/', {
    name: 'usersSearch',
    template: 'usersSearch',
    waitOn: function() {
      return Meteor.subscribe('keywords');
    },
    controller: UsersController
  });

  Router.route('/inbox', {
    name: 'usersInbox',
    template: 'usersInbox',
    waitOn: function() {
      return Meteor.subscribe('userPrivateThreads');
    },
    data: function() {
      return Threads.find({ memberIds: Meteor.userId(), isPrivate: true });
    },
    onBeforeAction: function() {
      if (this.data()) {
        // Once we have the threads, we subscribe and wait for the
        // users and last messages to come in as well.

        // Note: We no longer wait - we want this to be fast, so
        // the interface will show the URLs and be responsive
        // before we get full information on the actual threads themselves.
        var threadIds = this.data().map(function(thread) {
          return thread._id;
        });

        Meteor.subscribe('lastMessagesInThreads', threadIds);

        for (var i = 0; i < threadIds.length; i++) {
          Meteor.subscribe('userProfile',
            recipientIdInPrivateThread( Threads.findOne( threadIds[i]) ));
        }

        this.next();
      }
    },
    controller: UsersController
  });

  Router.route('/settings', {
    name: 'usersSettings',
    template: 'usersSettings',
    waitOn: function() {
    },
    controller: UsersController
  });

  Router.route('/users/:_id', {
    name: 'usersShow',
    template: 'usersShow',
    waitOn: function() {
      return Meteor.subscribe('userProfile', this.params._id);
    },
    data: function() {
      return Meteor.users.findOne(this.params._id);
    },
    controller: UsersController
  });
});
