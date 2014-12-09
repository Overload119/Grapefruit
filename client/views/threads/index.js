var threadLimitOptions = {
  limit: Session.get('threadLimit'),
  sort: { lastActiveAt: -1 },
  skip: Session.get('threadOffset')
}

Template.threadsIndex.helpers({
  threadCategories: function() {
    return Constants.THREAD_CATEGORIES;
  },
  currentCategory: function() {
    return Session.get('currentCategory');
  },
  currentCategoryName: function() {
    // Iterate through the categories and find the friendly name.
    for (var i = 0; i < Constants.THREAD_CATEGORIES.length; i++) {
      if (Constants.THREAD_CATEGORIES[i].dbName === Session.get('currentCategory')) {
        return Constants.THREAD_CATEGORIES[i].friendlyName;
      }
    }
    return 'Unknown Category';
  },
  threads: function() {
    return Threads.find({ category: Session.get('currentCategory') }, threadLimitOptions);
  },
  hasThreads: function() {
    return Threads.find({ category: Session.get('currentCategory') }, threadLimitOptions).count() > 0;
  },
  hasMoreThreads: function() {
    return Threads.find({ category: Session.get('currentCategory') }).count() >
      Threads.find({ category: Session.get('currentCategory') }, threadLimitOptions).count();
  },
  isLoadingThreads: function() {
    return Session.get('isLoadingThreads');
  },
  currentCategoryIs: function(dbName) {
    return Session.get('currentCategory') === dbName;
  }
});

Template.threadsIndex.events({
  'click #discuss-create-btn': function(evt, template) {
    var el = $(evt.currentTarget);
    var parentEl = el.closest('p');
    var createEl = el.closest('.module').find('.discuss-create');
    var isActive = createEl.hasClass('active');

    if (isActive) {
      parentEl.find('i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
      createEl.removeClass('active');
    } else {
      parentEl.find('i').addClass('fa-minus-circle').removeClass('fa-plus-circle');
      createEl.addClass('active');
    }

  },
  'click .thread-btn': function(evt, template) {
    var el = $(evt.currentTarget);
    var newCategory = el.data('category');

    // Do nothing if they click the same element.
    if (newCategory === Session.get('currentCategory')) {
      return;
    }

    Session.set('currentCategory', newCategory);
    // Must load new threads.
    Session.set('isLoadingThreads', true);
    Session.set('threadLimit', Constants.DEFAULT_LIMIT);
    Meteor.subscribe('discussions', newCategory, Session.get('threadLimit'),
      function onReady() {
        Session.set('isLoadingThreads', false);
      });
  },
  'click #submit-thread-btn': function(evt, template) {
    var el = $(evt.currentTarget);

    var threadContent = $('.thread-content').val();
    var threadTitle   = $('.thread-title').val();

    if (threadTitle.trim() === '') {
      $('.thread-title').notify('Required', { position: 'top left' });
      return;
    }

    if (threadContent.trim() === '') {
      $('.thread-content').notify('Required', { position: 'top left' });
      return;
    }

    var threadData = {
      category: Session.get('currentCategory'),
      title: threadTitle,
      content: threadContent
    };

    Meteor.call('startThreadWithCategory', threadData, function(err, res) {
      Router.go('discussShow', {
        _id: res._id
      });
    });
  }
});

Template.threadsIndex.rendered = function() {
  // EpicEditor doesn't work well with our custom font.
  // if(Meteor.user() && !this.editor){
  //   this.editor = new EpicEditor(Constants.EPIC_EDITOR_OPTIONS).load();
  //   $(this.editor.editor).bind('keydown', 'meta+return', function() {
  //     $(window.editor).closest('form').find('input[type="submit"]').click();
  //   });
  // }
};

Template.threadsIndex.created = function() {
  Session.setDefault('currentCategory', Constants.THREAD_CATEGORIES[0].dbName);
  Session.setDefault('isLoadingThreads', false);
  Session.setDefault('threadLimit', Constants.DEFAULT_LIMIT);
  Session.setDefault('threadOffset', 0);
};
