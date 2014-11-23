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
    controller: UsersController
  });

  Router.route('/users/:_id', {
    name: 'usersShow',
    data: function() {
      return Meteor.users.findOne(this.params._id);
    },
    controller: UsersController,
    template: 'usersShow'
  });
});
