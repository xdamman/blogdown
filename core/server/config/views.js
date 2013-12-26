var exphbs  = require('express3-handlebars')

module.exports = function(server) {

  var themePath = (server.content && server.content.paths) ? server.content.paths.theme : server.set('basePath')+"/themes/default";

  var hbs = exphbs.create({
      extname: '.hbs'
    , layoutsDir: themePath
    , partialsDir: themePath+"/partials"
    , defaultLayout: 'layout'
  });

  server.set('views', themePath); 
  server.set('view engine', 'hbs');
  server.engine('hbs', hbs.engine);
}
