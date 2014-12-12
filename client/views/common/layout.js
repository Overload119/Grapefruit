Template.layout.helpers({
  pageName: getCurrentTemplate,
  toggleActiveRouteNav: function(routeToCheck) {
    var currentRouteName = Router.current().lookupTemplate().toLowerCase();
    routeToCheck = routeToCheck.toLowerCase();

    return currentRouteName === routeToCheck ? 'active' : '';
  }
});

Template.layout.rendered = function() {
  $('.nav-left a').tooltipster({
    theme: 'tooltipster-light',
    contentAsHTML: true,
    animation: 'grow',
    speed: 250,
    position: 'left'
  });
}
