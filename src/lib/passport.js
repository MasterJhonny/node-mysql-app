// import module
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// import encrypt password helpers
const { helpers } = require('../lib/helpers');

//import module conecction database
const pool = require('../database');

passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log('list users valid', rows);
    if(rows.length > 0) {
        const user = rows[0];
        console.log('user get', user)
        const validPassword = await helpers.comparePassword(password, user.password);
        if(validPassword){
            done(null, user, req.flash('success', 'Welcome! '+ user.username));
        } else {
            done(null, false, req.flash('message', 'password incorrect!'))
        }
    } else {
        return done(null, false, req.flash('message', 'username does not exists!'));
    }
}));
    
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