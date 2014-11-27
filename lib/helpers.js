cleanUp = function(s){
  return stripHTML(s);
};

stripHtml = function(s){
  return s.replace(/<(?:.|\n)*?>/gm, '');
};

recipientIdInPrivateThread = function(thread) {
  check(thread, Object);

  var userId = Meteor.userId();

  if (!userId) {
    throw new Meteor.Error('No user ID was passed.');
  }

  var memberIds = thread.memberIds;
  var recipientId = _.without(memberIds, userId)[0];

  if (!recipientId) {
    throw new Meteor.Error('No recipient could be found');
  }

  return recipientId;
};
