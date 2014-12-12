Projects = new Meteor.Collection('projects');

ProjectsSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    defaultValue: new Date()
  },
  creatorId: { type: String, optional: false },
  memberIds: { type: String, defaultValue: [] },
  tagline: { type: String, optional: false},
  content: { type: String, optional: false },
  tags: { type: [String], defaultValue: [] },
  score: { type: Number, defaultValue: 0 }
});

Projects.attachSchema(ProjectsSchema);

Meteor.methods({
  createProject: function(project) {
    check(project, Object);
    check(project.tags, Array);

    if (!this.userId) {
      throw new Meteor.Error('You must be logged in to do that.');
    }

    var projectDoc = {
      creatorId: this.userId,
      content: project.content,
      tagline: project.tagline,
      tags: project.tags,
      score: 0
    };

    Projects.insert(projectDoc);

    return true;
  }
});

Projects.allow({
  update: function(userId, doc, fieldNames, modifier) {
    // Only the project creator can update the project.
    if (userId === doc.creatorId) {
      // Score cannot be updated by the creator.
      fieldNames = _.without(fieldNames, 'score');
      if (fieldNames.length > 0) {
        return true;
      }
    }

    return false;
  }
});
