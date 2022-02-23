// import module
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// import encrypt password helpers
const { helpers } = require('../lib/helpers');

//import module conecction database
const pool = require('../database');

passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body;

    const hasPassword = await helpers.encryptPassword(password);

    const newUser= {
        username,
        password: hasPassword,
        fullname
    }

    console.log(newUser);

    const rta = await pool.query('INSERT INTO users SET ?', [newUser]);

    console.log(rta);

    newUser.id = rta.insertId;

    return done(null, newUser);

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, users[0])
})