cleanUp = function(s){
  return stripHTML(s);
};

stripHtml = function(s){
  return s.replace(/<(?:.|\n)*?>/gm, '');
};
