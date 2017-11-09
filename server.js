var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var jwtSecret = 'fjkdlsajfoew239053/3uk';

var user = {
    username: 'test@test.com',
    password: 'Test@123'
};

var app = express();
var appRouter = express.Router();

app.use(cors());
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());
app.use(expressJwt({
    secret: jwtSecret
}).unless({
    path: ['/login']
}));


appRouter.post('/login', authenticate, function (req, res) {
    var token = jwt.sign({
        username: user.username
    }, jwtSecret);
    var timeStampInMs = Date.now();
    timeStampInMs += 900000;

    console.log(timeStampInMs);
    res.send({
        token: token,
        exp: timeStampInMs,
        user: user
    });
});

appRouter.get('/unauthorized', function (req, res) {
    var stat = '401 unauthorized'
    res.json({
        status: stat
    });
});

app.use('/', appRouter);

app.listen(process.env.PORT || 3000, function () {
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
