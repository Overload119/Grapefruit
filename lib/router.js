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
