var exphbs  = require('express3-handlebars')

module.exports = function(server) {

  var hbs = exphbs.create({
      extname: '.hbs'
    , layoutsDir: server.content.paths.theme
    , partialsDir: server.content.paths.theme+"/partials"
    , defaultLayout: 'layout'
  });

  server.set('views', server.content.paths.theme); 
  server.set('view engine', 'hbs');
  server.engine('hbs', hbs.engine);
}
