Template.usersInbox.helpers({
  hasThreads: function() {
    return Threads.find({
      isPrivate: true,
      memberIds: Meteor.userId(),
      messageCount: { $gt: 0 }
    }).count() > 0;
  },
  threadLimit: function() {
    return Session.get('inboxThreadLimit');
  },
  hasMoreThreads: function() {
    return Threads.find({ isPrivate: true, memberIds: Meteor.userId() }).count() > Session.get('threadsShown');
  },
  threads: function() {
    var threads = Threads.find({ isPrivate: true, memberIds: Meteor.userId() }, {
      sort: { createdAt: -1 }, limit: Session.get('inboxThreadLimit')
    });

    Session.set('threadsShown', threads.count());

    return threads.fetch();
  }
});

Template.usersInbox.created = function() {
  Session.setDefault('inboxThreadLimit', 10);
  Session.setDefault('threadsShown', 0);
};
