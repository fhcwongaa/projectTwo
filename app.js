var express = require('express');
var ejs = require('ejs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./sql/forum.db');
var fs = require('fs');
var request = require('request');

var passport = require('passport');
var dotenv = require('dotenv').load();
var methodOverride = require('method-override');



//middleware
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var urlencodedBodyParser = bodyParser.urlencoded({extended: false});
var FacebookStrategy = require('passport-facebook').Strategy;


  //sessions serializing
  passport.serializeUser(function(user, done){
  	console.log(user);
    done(null, user.id);

  });

  passport.deserializeUser(function(id, done){
  	console.log("deserializeUser" + id);
    db.get('SELECT id, access_Token, name, image FROM users WHERE id = ?',id,function(err,row){
    	console.log("row");
      if(!row) return done(null,false);
      console.log(row);
      //get the user from the database
      return done(null, row);
    })
  });




passport.use(new FacebookStrategy({
    clientID: process.env.fbkey,
    clientSecret: process.env.secretkey2,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
    function(accessToken, refreshToken, profile, done){
      // asynchronous verification, for effect...
      console.log("hhit");
      process.nextTick(function () {
        console.log("hhit");
       //  To keep the example simple, the user's Facebook profile is returned to
       //  represent the logged-in user.  In a typical application, you would want
       //  to associate the Facebook account with a user record in your database,
       //  and return that user instead.
       console.log(profile.username);
       var image = "https://graph.facebook.com/" + profile.id+ "/picture" + "?width=200&height=200" + "&access_token=" + accessToken;
       console.log(image);
        // get the user
		     db.get('SELECT id, access_Token, name, image FROM users WHERE id =?', profile.id, function(err, row) {
		     		console.log(row);
		          if (err){
		            //if user does not exist
		            console.log("hit1");
		            return done(null, false);
		          }
		          if(row){
		            //if user is already in the database
		             console.log("hit2");
		            return done(null, row);
		          }else{
		            //if user is not in the database, store user
		             console.log("hit3");
		            db.run('INSERT INTO users (id, access_token, name,image) VALUES (?,?,?,?)', profile.id,accessToken,profile.displayName,image, function(err,row){
		              if(err){
		                console.log(err);
		              }else{
		                db.get('SELECT id, access_token, name,image FROM users WHERE id =?',profile.id,function(err,row2){
		                  return done(null,row2);
		                });
		              }
		            });
		            
		          }
		          
		        console.log(profile);
		      });
		})
	}  

  ));

var app = express();
app.use(methodOverride('_method'));
app.set('view_engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(urlencodedBodyParser);



app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session




require('./routes/routes.js')(app,passport,fs,db,ejs,request);



app.listen(3000,function(){
	console.log("listening");
});







