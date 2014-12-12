Meteor.publish('projects', function(criteria, extraOptions) {
  check(criteria, Object);

  if (!extraOptions) {
    extraOptions = { limit: 30 };
  }

  return Projects.find(criteria, extraOptions);
});
