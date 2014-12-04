Template.usersSettings.helpers({
  maybeActiveLA: function(tag) {
    var hasTag = _.contains(this.listedAs, tag);
    if (hasTag) {
      return 'active';
    }
    return '';
  },
  maybeActiveLF: function(tag) {
    var hasTag = _.contains(this.lookingFor, tag);
    if (hasTag) {
      return 'active';
    }
    return '';
  },
});

Template.usersSettings.events({
  'click #summaryPanel button': function(evt, template) {
    var el        = $(evt.currentTarget);
    var panel     = $('#summaryPanel');

    if (panel.hasClass('editing')) {
      // We were editing before so now we save.
      panel.removeClass('editing');

      el.find('.icon i').removeClass('fa-save').addClass('fa-edit');
      el.find('.text').html('Edit');

      var newSummaryValue = cleanUp(panel.find('textarea').val());

      Meteor.users.update({ _id: this._id }, {
        $set: { summary: newSummaryValue }
      });
    } else {
      // Begin editing.
      panel.addClass('editing');
      panel.find('textarea').val( this.summary );

      el.find('.icon i').removeClass('fa-edit').addClass('fa-save');
      el.find('.text').html('Save');
    }
  },
  'click .role': function(evt, template) {
    var el        = $(evt.currentTarget);
    var dataRole  = el.data('role');
    var key       = el.closest('.role-options').data('user-key');

    var payLoad   = {};
    payLoad[ key ] = dataRole;

    if (el.hasClass('active')) {
      Meteor.users.update({ _id: this._id }, {
        $pull: payLoad
      });
    } else {
      Meteor.users.update({ _id: this._id }, {
        $addToSet: payLoad
      });
    }
  }
});
