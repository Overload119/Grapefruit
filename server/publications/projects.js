Meteor.publish('projects', function(criteria, options) {
  check(criteria, Object);
  check(options, Object);

  if (this.userId) {
    return Projects.find(criteria, options);
  }

  return [];
});

Meteor.publishComposite('projectWithUsers', function(projectId) {
  return {
    find: function() {
      return Projects.find({ _id: projectId }, { limit: 1 });
    },
    children: [
      {
        find: function(project) {
          return Meteor.users.find({ _id: { $in: project.memberIds } },
            { fields: Constants.PUBLIC_USER_FIELDS });
        }
      }
    ]
  }
});
