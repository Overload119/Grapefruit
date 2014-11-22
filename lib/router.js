Router.onBeforeAction(function() {
  if (Meteor.user()) {
    this.render('dashboard');
  } else {
    this.render('frontpage');
  }
});

Router.route('/dashboard', function() {
  this.render('/dashboard');
});

Router.route('/', function() {
  this.render('frontpage');
});

Router.route('/users/:_id', {
  name: 'users.show',
  waitOn: function() {
    return Meteor.users.findOne({ _id: this.params._id });
  },
  action: function() {
    this.render('users.show');
  }
});
