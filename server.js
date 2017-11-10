var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var jwtSecret = 'fjkdlsajfoew239053/3uk';
var jwtRefreshSecret = 'kjahsduibdsash8783/9ok';

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
    path: ['/login', '/unauthorized', '/refresh']
}));


appRouter.post('/login', authenticate, function (req, res) {
    var userId = '12345';
    var accessToken = jwt.sign({
        username: user.username
    }, jwtSecret);
    var refreshToken = jwt.sign({
        username: user.username
    }, jwtRefreshSecret);

    var timeStampInMs = Date.now();
    timeStampInMs += 900000;

    var timeStampInMsRefreshToken = Date.now();
    timeStampInMsRefreshToken += 1800000;

    console.log(timeStampInMs);
    console.log(timeStampInMsRefreshToken);

    var payload = [{
        "userId": userId,
        "tokens": {
            "accessToken": accessToken,
            "expiresIn": 180,
            "refreshExpiresIn": 360,
            "refreshToken": refreshToken,
            "tokenType": "bearer",
            "sessionState": "2ac48b88-cfbb-46ee-8bfa-03f2eb5bfa4b",
            "primaryAuth": true
        }
    }];

    res.send({
        success: "true",
        payload: payload
    });
});

appRouter.post('/refresh', refreshAuthenticate, function (req, res) {
    var userId = '12345';
    var accessToken = jwt.sign({
        username: user.username
    }, jwtSecret);

    var timeStampInMs = Date.now();
    timeStampInMs += 900000;

    var timeStampInMsRefreshToken = Date.now();
    timeStampInMsRefreshToken += 1800000;
    console.log(req);
    console.log(timeStampInMs);
    console.log(timeStampInMsRefreshToken);

    var payload = [{
        "userId": userId,
        "tokens": {
            "accessToken": accessToken,
            "expiresIn": 180,
            "refreshExpiresIn": 360,
            "refreshToken": req.body.refreshToken,
            "tokenType": "bearer",
            "sessionState": "2ac48b88-cfbb-46ee-8bfa-03f2eb5bfa4b",
            "primaryAuth": true
        }
    }];

    res.send({
        success: "true",
        payload: payload
    });
});

appRouter.get('/unauthorized', function (req, res) {
    res.json({
        status: '401 unauthorized'
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

function refreshAuthenticate(req, res, next) {
    var body = req.body;
    if (!body.username || !body.password || !body.refreshToken) {
        res.status(400).end('Must provide username or password');
    } else if (body.username !== user.username || body.password !== user.password) {
        res.status(401).end('Username or password incorrect');
    } else if (body.username !== user.username || body.password !== user.password) {
        res.status(401).end('refresh token invalid');
    } else {
        next();
    }
}
