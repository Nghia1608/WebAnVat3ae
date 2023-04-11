const path = require("path");
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require("dotenv").config();
const route = require('./src/routes');
const db = require('./src/config/db')
const cookie = require('cookie-parser')


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./key');

const cookieSession = require('cookie-session')
//Connect GG

//Connect to DB
db.connect();
// import fetch from 'node-fetch';

app.use(express.static(path.join(__dirname,'src/public')))
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({
  extended : true
}));
app.use(
  bodyParser.urlencoded({
      extended: true,
  }),
);
app.use(express.json());
app.use(morgan('combined'));
app.use(methodOverride('_method'));
app.engine('hbs', handlebars.engine({
  extname : '.hbs',
  helpers : {
    sum : (a,b) => a + b,
  }
}));
app.use(cookie())



app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'src/resources/views'));
const viewspath = path.join(__dirname);
console.log(viewspath)


//routes init
route(app)



app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});