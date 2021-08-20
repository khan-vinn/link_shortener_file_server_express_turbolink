const express = require('express');
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User } = require('../models');
const { ensureFromAuthenticated, flashMessageProvideToRender, ensureNotAuthenticated } = require('../middleware/middleware');
const { authParamsValidate, updateUserPassword, updateUserUsername, signupParamsValidate } = require('../middleware/auth');
const router = express.Router();

router.get("/", ensureFromAuthenticated, flashMessageProvideToRender, (req, res) => {
    res.render("users/auth")
})

router.post("/signin",
    authParamsValidate, ensureFromAuthenticated,
    passport.authenticate('local', { failureRedirect: '/auth', failureFlash: "Password or username incorrected" }),
    (req, res) => {
        res.redirect("/")
    })

router.get("/logout", ensureNotAuthenticated, (req, res) => {
    req.flash("success", "You are logout! To continue please sign in or sign up. ")
    req.logOut()
    res.redirect("/auth")
})

router.get("/update", ensureNotAuthenticated, (req, res) => {
    res.render("users/settings")
})

router.post("/update", ensureNotAuthenticated, updateUserUsername, updateUserPassword,
    (req, res) => {
        req.flash("error", "Please check your inserted data")
        return res.redirect("/")
    })

router.post("/signup",
    ensureFromAuthenticated, signupParamsValidate,
    (req, res, next) => {
        const { username, password } = req.body
        User.findOne({ username })
            .then(user => {
                if (user) {
                    req.flash("error", `username: ${req.body.username} not valid. Try another u-name!`)
                    return res.redirect("/auth")
                } else if (!user) {
                    return bcrypt.hash(password, 12)
                }
            })
            .then(hash => User.create({ username, password: hash }))
            .then(user => next(null, user))
            .catch(error => {
                req.flash("error", `${error.name}::${error.message}`)
                return res.redirect("/auth")
            })
    }, passport.authenticate("local", { failureRedirect: "/auth" }), (req, res) => {
        req.flash("success", "successufly registred")
        res.redirect("/")
    })

module.exports = router;
