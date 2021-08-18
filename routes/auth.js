const express = require('express');
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User } = require('../models');
const { ensureFromAuthenticated, flashMessageProvideToRender, ensureNotAuthenticated } = require('./middleware');
const router = express.Router();

router.get("/", ensureFromAuthenticated, flashMessageProvideToRender, (req, res) => {
    res.render("users/auth")
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
            }
        } else {
            req.flash("error", "too short password/ min length of password is 6")
            res.redirect("/auth")
        }
    },
    ensureFromAuthenticated,
    passport.authenticate('local', { failureRedirect: '/auth', failureFlash: "Password or login incorrected" }),
    (req, res) => {
        res.redirect("/")
    })

router.get("/logout", ensureNotAuthenticated, (req, res, next) => {
    req.logOut()
    req.flash("success", "You are logout! To continue please sign in or sign up. ")
    res.redirect("/auth")
})

router.post("/update", ensureNotAuthenticated, (req, res, next) => {
    if (req.body.username && req.body.username.length > 4) {
        User.findOneAndUpdate({ _id: req.user._id, username: req.user.username }, { username: req.body.username }, { new: true }, (err, user) => {
            if (err) {
                req.flash("error", `${err.name}::${err.message}`)
                return res.redirect("/")
            } else if (!user) {
                req.flash("error", "Dont update username")
                return res.redirect("/")
            }
            req.flash("success", "User name successfuly updated")
            return res.redirect("/")
        })
    } else if (req.body.old_pass && req.body.new_pass && req.body.confirm_new_pass) {
        if (req.body.old_pass.length > 5) {
            if (req.body.new_pass === req.body.confirm_new_pass) {
                bcrypt.compare(req.body.old_pass, req.user.password, (err, data) => {
                    if (err) {
                        req.flash("error", "error to compare passwords/ try later")
                        return res.redirect("/")
                    } else if (!data) {
                        console.log(data)
                        req.flash("error", "incorrect old password")
                        return res.redirect("/")
                    }
                    hash = bcrypt.hash(req.body.new_pass, 12, (err, data) => {
                        if (err) {
                            req.flash("error", "Error to hashing new password")
                            return res.redirect("/")
                        } else if (!data) {
                            req.flash("error", "Error to hash, choose another password")
                            return res.redirect("/")
                        }
                        console.log(req.body.new_pass)
                        User.findOneAndUpdate({ _id: req.user._id, username: req.user.username }, { password: data }, { new: true, timestamps: false }, (err, user) => {
                            if (err) {
                                req.flash("error", `${err.name}::${err.message}`)
                                return res.redirect("/")
                            } else if (!user) {
                                req.flash("error", "error on update in DB")
                                return res.redirect("/")
                            }
                            req.flash("success", "Successufuly account updated")
                            return res.redirect("/")
                        })
                    })
                })
            } else {
                req.flash("error", "new passwords will be equal")
                return res.redirect("/")
            }
        } else {
            req.flash("error", "Password length will be greater than 6")
            return res.redirect("/")
        }
    } else {
        req.flash("error", "Enter correct data")
        return res.redirect("/")
    }
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
                } else {
                    bcrypt.hash(req.body.password, 12)
                        .then(hash => {
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
                        }).catch(e => {
                            req.flash("error", e.toString())
                            res.redirect("/")
                        })
                }
            })

        } else {
            req.flash("error", "too short password or password dont equal password confirm")
            res.redirect("/auth")
        }
    } else {
        req.flash("error", "too short length username( > 4 || < 20)")
        res.redirect("/auth")
    }
}, passport.authenticate("local", { failureRedirect: "/auth" }), (req, res) => {
    req.flash("success", "successufly registred")
    res.redirect("/")
})

module.exports = router;
