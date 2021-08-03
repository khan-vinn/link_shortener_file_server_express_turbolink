const express = require('express');
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User } = require('../models');
const { ensureFromAuthenticated } = require('./middleware');
const router = express.Router();

router.get("/", ensureFromAuthenticated, (req, res) => {
    res.render("auth")
})

router.post("/signin",
    (req, res, next) => {
        if (typeof (req.body.username) === "string"
            && (req.body.username.length > 4)
            && (req.body.username.length < 18)) {
            if (typeof (req.body.password) === "string"
                && (req.body.password.length > 5)) {
                next()
            } else {
                req.flash("error", "too short or long username min length is 5 and max length is 17")
                res.redirect("/auth")
                // return res.render("error", { message: "Validate Error", error: { status: 500, stack: "too short or long username min length is 5 and max length is 17" } })
            }
        } else {
            req.flash("error", "too short password/ min length of password is 6")
            res.redirect("/auth")
            // return res.render("error", { message: "Validate Error", error: { status: 500, stack: "too short password/ min length of password is 6 " } })
        }
    },
    ensureFromAuthenticated,
    passport.authenticate('local', { failureRedirect: '/auth', failureFlash: "Password or login incorrected" }),
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
                    req.flash("error", `username: ${req.body.username} not valid. Try another u-name!`)
                    res.redirect("/auth")
                    // res.render("error", {
                    //     message: "DB Validate Error", error: {
                    //         status: 403, stack: "Please choose another username"
                    //     }
                    // })
                } else {
                    bcrypt.hash(req.body.password, 12).then(hash => {
                        User.create({
                            username: req.body.username,
                            password: hash
                        }, (err, doc) => {
                            if (err) {
                                req.flash("error", err)
                                res.redirect("/")
                            } else {
                                next(null, doc)
                            }
                        })
                    })
                }
            })

        } else {
            req.flash("error", "too short password or password dont equal password confirm")
            res.redirect("/auth")
            // return res.render("error", { message: "Validate Error", error: { status: 500, stack: "too short password or password dont equal password confirm" } })
        }
    } else {
        req.flash("error", "too short length username( > 4 || < 20)")
        res.redirect("/auth")
        // return res.render("error", { message: "Validate Error", error: { status: 500, stack: "too short length username( > 4 || < 20)" } })
    }
}, passport.authenticate("local", { failureRedirect: "/auth" }), (req, res) => {
    res.redirect("/")
})

module.exports = router;