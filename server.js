var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var jwtSecret = 'fjkdlsajfoew239053/3uk';

var user = {
  username: 'samirshah@deloitte.com',
  password: 'Test@123'
};

var app = express();

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(expressJwt({ secret: jwtSecret }).unless({ path: [ '/login' ]}));


app.post('/login', authenticate, function (req, res) {
  var token = jwt.sign({
    username: user.username
  }, jwtSecret);
  res.send({
    token: token,
    user: user
  });
});


app.listen(3000, function () {
  console.log('App listening on localhost:3000');
});

// UTIL FUNCTIONS

function authenticate(req, res, next) {
  var body = req.body;
  if (!body.username || !body.password) {
    res.status(400).end('Must provide username or password');
  } else if (body.username !== user.username || body.password !== user.password) {
    res.status(401).end('Username or password incorrect');
  } else {
    next();
  }
}
