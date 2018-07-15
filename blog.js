// blog.js

console.log("Murph'z blog server is running...");

//v8-debug/build/debug/v0.7.7/node-v46-darwin-x64/debug.node
// git@gitlab.tlmworks.org:murph/Space_Invaders_2.git  --- OLD REMOTE

var express = require("express");
var app = express();
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');


var db = require('./model/db');

var home = require('./controllers/home');
var user = require('./controllers/user');
var project = require('./controllers/project');

var credentials = require('./credentials.js');

require('./config/passport')(passport); // pass passport for configuration

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// *** Deprecated ***
// var MongoSessionStore = require('session-mongoose')(require('connect')); 
// var sessionStore = new MongoSessionStore({ url: db.dbURI });
// app.use(require('cookie-parser')(credentials.cookieSecret));
// app.use(require('express-session')({ store: sessionStore, secret: 'ilovescotchscotchyscotchscotch', resave:true, saveUninitialized:true }));

/*
//  works for request service 
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch',
    // store: new MongoStore({ mongooseConnection: db }),  Changed to line below
    // db:  db,
    resave: true,
    saveUninitialized: true
}));
*/

var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
app.use(require('cookie-parser')(credentials.cookieSecret));
var store = new MongoDBStore({
    uri: db.URI,  //'mongodb://localhost:27017/blog_database',
    collection: 'mySessions'
  });
app.use(session({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true
}));



app.use(passport.initialize());
app.use(passport.session());  // persistent login sessions
app.use(flash()); // Use connect-flash for flash messages stored in session

var handlebars = require('express3-handlebars').create({defaultLayout:'main', extname: '.handlebars'});

var body = require('body-parser');  //  *** Not Used ??? ***

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars')

app.set('port', process.env.PORT || 9009);

app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

// Place here before routes to work!!!
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
  }
}));

// ROUTES -- All routes are in the routes directory
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.use(express.static(__dirname + '/public'));

// custom 404 page
app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(500);
    res.render('500');
});

// Start the server
app.listen(app.get('port'), function(){
  console.log("Live at Port " + app.get('port') 
    + " \nPress Control-C to terminate node server");
});




