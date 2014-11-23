Template.layout.helpers({
  pageName: getCurrentTemplate,
  shouldShowNav: function() {
    return Session.get('shouldShowNav');
  },
  toggleActiveRouteNav: function(routeToCheck) {
    var currentRouteName = Router.current().lookupTemplate().toLowerCase();
    routeToCheck = routeToCheck.toLowerCase();

    return currentRouteName === routeToCheck ? 'active' : '';
  }
});
