Template.layout.helpers({
  pageName: getCurrentTemplate,
  toggleActiveRouteNav: function(route1, route2, route3, route4, route5) {
    var cssClass = '';
    // This is hack to get splat arguments in a helper.
    var routesToCheck = _.filter(
      _.compact([route1, route2, route3, route4, route5]),
      function(el) { return typeof(el) === 'string' });

    _.each(routesToCheck, function(routeToCheck) {
      var currentRouteName = Router.current().lookupTemplate().toLowerCase();
      routeToCheck = routeToCheck.toLowerCase();

      if (currentRouteName === routeToCheck) {
        cssClass = 'active';
      }
    });

    return cssClass;
  }
});

Template.layout.rendered = function() {
  $('.nav-left a').tooltipster({
    theme: 'tooltipster-light',
    contentAsHTML: true,
    animation: 'grow',
    speed: 250,
    delay: 400,
    position: 'bottom',
    offsetY: -15
  });
}
