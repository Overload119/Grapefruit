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
  'keyup .tag-textbox': function(evt, template) {
    // Enter is a shortcut to submit.
    if (evt.keyCode === 13) {
      el = $(evt.currentTarget);
      el.siblings('.tag-submit').click();
    }
  },
  'click .tag-submit': function(evt, template) {
    var el = $(evt.currentTarget);
    var txtbox = el.siblings('.tag-textbox');
    var userKey = el.closest('.list-card').data('user-key');
    var payload = {}
    payload[ userKey ] = txtbox.val();

    if (txtbox.val() === '') {
      return;
    }

    if (_.contains(template.data.interests, txtbox.val().toLowerCase())) {
      txtbox.notify(txtbox.val() + ' has already been added.', { position: 'top left' });
      txtbox.val('');
      return;
    }

    txtbox.val('');

    Meteor.users.update({ _id: this._id }, {
      $addToSet: payload
    });

    // Scroll to bottom if possible.
    var newEl = el.closest('.list-card').find('.list li:last').addClass('appear');
    el.closest('.list-card').find('.list').scrollToBottom(500);
    Meteor.defer(function() {
      newEl.removeClass('appear');
    });
  },
  'click .remove-tag-btn': function(evt, template) {
    el = $(evt.currentTarget);
    var tag = el.data('tag');
    var userKey = el.closest('.list-card').data('user-key');
    var payload = {};
    payload[ userKey ] = tag;

    // Must use template.data here because `this` changed scope since this element is in a
    // #each loop.
    Meteor.users.update({ _id: template.data._id }, {
      $pull: payload
    });
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