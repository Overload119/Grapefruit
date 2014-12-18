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
  picture: { type: String, optional: true },
  creatorId: { type: String, optional: false },
  memberIds: { type: [String], defaultValue: [] },
  tagline: { type: String, optional: false},
  title: { type: String, optional: false },
  content: { type: String, optional: false },
  tags: { type: [String], defaultValue: [] },
  score: { type: Number, defaultValue: 0 },
  likerIds: { type: [String], defaultValue: [] }
});

Projects.attachSchema(ProjectsSchema);

Meteor.methods({
  toggleLikeOnProject: function(projectId) {
    var liked   = false;
    var project = Projects.findOne(projectId);

    if (!project) {
      throw new Meteor.Error('Project not found with ID: ' + projectId);
    }

    if (!this.userId) {
      throw new Meteor.Error('You must be logged in to do that.');
    }

    if (_.contains(project.likerIds, this.userId)) {
      // Remove
      Projects.update({ _id: projectId }, {
        $pull: { likerIds: this.userId },
        $inc: { score: -1 }
      });

      liked = false;
    } else {
      liked = true;

      Projects.update({ _id: projectId }, {
        $addToSet: { likerIds: this.userId },
        $inc: { score: 1 }
      });
    }

    return liked;
  },
  createProject: function(project) {
    check(project, Object);
    check(project.title, String);
    check(project.content, String);
    check(project.tagline, String);
    check(project.tags, Array);

    if (!this.userId) {
      throw new Meteor.Error('You must be logged in to do that.');
    }

    var projectDoc = {
      creatorId: this.userId,
      memberIds: [ this.userId ],

      title: project.title,
      content: project.content,
      tagline: project.tagline,
      tags: project.tags,

      score: 0
    };

    var projectId = Projects.insert(projectDoc);

    return Projects.findOne(projectId);
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
