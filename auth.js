const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("./models");
const bcrypt = require("bcrypt")

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            bcrypt.compare(password, user.password)
                .then(value => {
                    if (!value) {
                        return done(null, false);
                    }
                    return done(null, user);
                })

        });
    }
));

module.exports = passport