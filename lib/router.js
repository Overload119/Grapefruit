Router.onBeforeAction(function() {
  if (Meteor.user()) {
    // User is not logged in. Show login.
    this.render('dashboard');
  } else {
    this.render('frontpage');
  }
});

Router.route('/dashboard', function() {
  console.log('dashboard');
  this.render('/dashboard');
});

Router.route('/', function() {
  this.render('frontpage');
});
