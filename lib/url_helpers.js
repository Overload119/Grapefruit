getCurrentTemplate = function() {
  return Router.current().lookupTemplate();
};
getCurrentRoute = function() {
  return Router.current().url;
};
