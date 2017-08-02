
/**
 * Module dependencies.
 */




var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var registerpage = require('./routes/register');
var homepage = require('./routes/home');
var loginpage = require('./routes/index');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

var session = require('express-session');



app.use(session({
    secret: "session", 
    resave: true, 
    saveUninitialized: true, 
    cookie: { secure: true }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
	  errorFormatter: function(param, msg, value) {
	      var namespace = param.split('.')
	      , root    = namespace.shift()
	      , formParam = root;

	    while(namespace.length) {
	      formParam += '[' + namespace.shift() + ']';
	    }
	    return {
	      param : formParam,
	      msg   : msg,
	      value : value
	    };
	  }
	}));

app.use(flash());

//Global Vars
app.use(function (req, res, next) {
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error = req.flash('error');
res.locals.user = req.user || null;
next();
});


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/register',registerpage.register);
app.get('/home',homepage.home);
app.get('/login', loginpage.login);

app.post('/save', homepage.save);
app.post('/logout', homepage.logout);
app.post('/login', loginpage.authenticate);
app.post('/home', homepage.signup);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
