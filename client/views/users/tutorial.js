Template.usersTutorial.helpers({
  locationErrorMessage: function() {
    return Session.get('tutorial-location-error-message');
  }
});

Template.usersTutorial.events({
  'click #start-tutorial': function(evt, template) {
    Session.set('tutorial-step', 1);
  },
  'click #request-location': function(evt, template) {
    template.$('#request-location').disable();
    template.getLocation();
  },
  'click .continue-btn.basic': function(evt, template) {
    Session.set('tutorial-step', +$(evt.currentTarget).data('next'));
  },
  'click .toggles li': function(evt, template) {
    var el          = $(evt.currentTarget);
    var sessionKey  = el.closest('ul').attr('id') === 'listed-as-list' ?
                      'tutorialListedAs' :
                      'tutorialLookingFor'

    if (el.hasClass('selected')) {
      el.removeClass('selected');
    } else {
      el.addClass('selected');
    }

    var sessionResult = el.closest('ul').find('.selected').map(function(i, domEl) {
      return domEl.dataset.which;
    }).get();

    Session.set(sessionKey, sessionResult);
  },
  'click .exit-btn': function(evt, template) {
    var newUserFields = {
      lookingFor: Session.get('tutorialLookingFor'),
      listedAs: Session.get('tutorialListedAs'),
      isTutorialComplete: true
    };
    Meteor.call('completeTutorial', newUserFields, function(err, result) {
      if (!err) {
        // isTutorialComplete should be set to true, and the template will automatically render.
      } else {
        alert('Sorry an error occured. Please try again later.');
      }
    });
  }
});

Template.usersTutorial.created = function() {
  this.getLocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getLocationCb.bind(this),
        this.getLocationErrorCb.bind(this));
    } else {
      alert('Sorry - your browser doesn\'t support Geolocation.');
    }
  };

  this.getLocationErrorCb = function(err) {
    this.$('#request-location').enable();

    switch(err.code) {
      case err.PERMISSION_DENIED:
        Session.set('tutorial-location-error-message',
          'Please allow OrangePeel to find your location in order to advance to the next step.');
        break;
      case err.POSITION_UNAVAILABLE:
      case err.TIMEOUT:
        Session.set('tutorial-location-error-message',
          'Your location is not currently available. Please try again later.');
        break;
      case err.TIMEOUT:
        Session.set('tutorial-location-error-message', '');
        break;
      case err.UNKNOWN_ERROR:
      default:
        Session.set('tutorial-location-error-message',
          'An unknown error occured when finding your location.');
        break;
    }
  };

  this.getLocationCb = function(pos) {
    this.$('#request-location').enable();

    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;

    Meteor.call('updateCurrentUserLocation', lat, lng, function(err, result) {
      if (err) {
        Session.set('tutorial-location-error-message',
          'An error occured saving your location. Please try again later.');
      } else {
        Session.set('tutorial-step', 2);
      }
    }.bind(this));
  }
};

Template.usersTutorial.rendered = function() {
  this.windowHeight = $(window).height();
  this.$('.tutorial-screen').height( this.windowHeight );
  Session.setDefault('tutorial-step', 0);
  Session.setDefault('tutorialListedAs', []);
  Session.setDefault('tutorialLookingFor', []);

  this.autorun(function() {
    var tutorialStep = Session.get('tutorial-step');
    this.$('.step.slideIn').removeClass('slideIn').addClass('slideOut')
      .one('transitionend', function() {
        this.$('.step').eq(Session.get('tutorial-step')).addClass('slideIn');
      }.bind(this));
  }.bind(this));

  // Begin the tutorial by starting at the first step.
  Meteor.defer(function() {
    this.$('.tutorial-screen .step').eq(Session.get('tutorial-step')).addClass('slideIn');
  });
};
