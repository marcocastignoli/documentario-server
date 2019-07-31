var express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  sequelize = require('sequelize'),
  passport = require('passport'),
  jwt = require('jsonwebtoken'),
  path = require('path'),
  fileUpload = require('express-fileupload'),
  cors = require('cors')

var hookJWTStrategy = require('./services/passportStrategy');
var app = express();

app.use(cors());

// parse as urlencode and json
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// hook up the HTTP logger
app.use(morgan('dev'));

// hook up passport
app.use(passport.initialize());

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// hook the passport jwt strategy
hookJWTStrategy(passport);

// bundle api routes
var router = require('./routes/api')(passport);
app.use('/', router);

// start the server
app.listen('8888', function () {
  console.log('Magic happens at http://localhost:8888/! We are all now doomed!');
});
