const express = require('express');
const morgan = require('morgan');
const { create } = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const MysqlStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

const path = require('path');

// initializaciones
const app = express();
require('./lib/passport');

// Settings definitions
const port = process.env.PORT || 4400;
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', create({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}).engine);
app.set('view engine', '.hbs');

// middelwares
app.use(session({
    secret: 'userssession',
    resave: false,
    saveUninitialized: false,
    store: new MysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


// variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/autentication'));
app.use('/links', require('./routes/links'));


// public 
app.use(express.static(path.join(__dirname, 'public'))); 

// start server
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});