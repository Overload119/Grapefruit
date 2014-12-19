UsersController = FastRender.RouteController.extend({
  layoutTemplate: 'layout',
  onBeforeAction: function() {
    // Ensure that the user finishes the tutorial before using their dashboard.
    if (!!Meteor.user()) {
      if (Meteor.user().isTutorialComplete) {
        this.layout('layout');
        this.next();
      } else {
        this.layout('staticLayout');
        this.render('usersTutorial');
      }
    } else {
      this.layout('staticLayout');
      this.render('frontpage');
      this.next();
    }
  }
});

Meteor.startup(function() {

  Router.route('/inbox', {
    name: 'usersInbox',
    template: 'usersInbox',
    waitOn: function() {
      return Meteor.subscribe('userPrivateThreads');
    },
    data: function() {
      return Threads.find({ memberIds: Meteor.userId(), isPrivate: true });
    },
    controller: UsersController
  });

  Router.route('/settings', {
    name: 'usersSettings',
    template: 'usersSettings',
    data: function() {
      return Meteor.user();
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
