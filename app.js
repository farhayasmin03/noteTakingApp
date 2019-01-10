const http = require('http');
var cuid = require('cuid');
var test = cuid();
console.log(test);
const request = require('request');
const port = 3000;
var express = require('express');

var app = express();
const bodyParser = require('body-parser');

var ejs = require('ejs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));
var mongoose = require('mongoose');
var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://localhost/testForAuth');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("we're connected!")
});

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    //   store: new MongoStore({
    //     mongooseConnection: db
    //   })
}));

var routes = require('./routes/router');
app.use('/', routes);


app.set('view engine', 'ejs');
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });
  

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});