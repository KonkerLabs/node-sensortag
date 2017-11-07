const
    express = require('express'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    http = require('http'),
    axios = require('axios');

const localDB = require('./data/localdb');

require('./data/winstonConfig')

const DATA_URL = 'https://data.demo.konkerlabs.net'

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

/* Authentication */

const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: localDB.getParameter('FACEBOOK_APP_ID'),
        clientSecret: localDB.getParameter('FACEBOOK_APP_SECRET'),
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'gender', 'age_range', 'birthday', 'first_name']
    },
    function (accessToken, refreshToken, profile, cb) {
        // In this example, the user's Facebook profile is supplied as the user
        // record.  In a production-quality application, the Facebook profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        return cb(null, profile);
    }
));

const app = express();
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({
    secret: '4umn5mhd2ctf',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/login.html'}),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/vote.html');
    });

app.get('/vote.html',
    function (req, res, next) {
        if (!req.user || !req.session.token) {
            res.redirect('/login.html');
            return;
        }

        // validate token
        let location = localDB.findLocationByToken(req.session.token);
        if (location === undefined) {
            res.redirect('/errortoken.html');
            return;
        }

        next();
    });

app.get('/login.html',
    function (req, res, next) {
        if (req.query.token) {
            req.session.token = req.query.token;
            next();
        } else {
            res.redirect('/errortoken.html');
        }
    });

app.get('/',
    function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/login.html');
        }
    });

app.post('/api/vote',
    function (req, res) {
        let location = localDB.findLocationByToken(req.session.token);

        if (req.user) {
            let json = req.body;
            json.user = req.user._json;

            username = location.username
            password = location.password
            axios.post(`${DATA_URL}/pub/${username}/vote`,
                json,
                {
                    auth: {
                        username: username,
                        password: password
                    }
                });

            req.logout();
            res.send(json);    // echo the result back
        } else {
            res.sendStatus(403);
        }
    });

app.use(express.static('public'));

/** Start app **/

app.set('port', process.env.PORT || 3000);
app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
if (process.env.NODE_ENV === 'production') {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), () => {
    LOGGER.debug("Express server started at port %s", app.get('port'));
});

module.exports = app