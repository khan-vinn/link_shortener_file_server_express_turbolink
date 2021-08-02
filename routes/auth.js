const express = require('express');
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User } = require('../models');
const { ensureFromAuthenticated } = require('./middleware');
const router = express.Router();

router.get("/", ensureFromAuthenticated, (req, res) => {
    res.render("auth")
})

router.post("/signin", ensureFromAuthenticated,
    passport.authenticate('local', { failureRedirect: '/auth' }),
    (req, res) => {
        res.redirect("/")
    })

router.get("/logout", (req, res, next) => {
    req.logOut()
    res.redirect("/auth")
})

router.post("/signup", ensureFromAuthenticated, (req, res, next) => {
    if (typeof (req.body.username) === "string"
        && req.body.username.length > 4
        && req.body.username.length < 21) {
        if ((typeof (req.body.password) === "string")
            && (typeof (req.body.con_password) === "string")
            && (req.body.con_password === req.body.password)
            && (req.body.password.length > 5)
        ) {
            User.findOne({ username: req.body.username }, (err, user) => {
                if (err) {
                    next(err)
                } else if (user) {
                    res.redirect("/")
                } else {
                    const hash = bcrypt.hashSync(req.body.password, 12)
                    User.create({
                        username: req.body.username,
                        password: hash
                    }, (err, doc) => {
                        if (err) {
                            console.log(err)
                            res.redirect("/")
                        } else {
                            console.log(doc)
                            next(null, doc)
                        }
                    })
                }
            })

        } else {
            res.status(304).send("too short password or password dont equal password confirm")
        }
    } else {
        res.status(304).send("too short length username ( > 4 || < 20)")
    }
}, passport.authenticate("local", { failureRedirect: "/auth" }), (req, res) => {
    res.redirect("/")
})

module.exports = router;