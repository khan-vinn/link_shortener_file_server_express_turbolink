const passport = require("./auth")
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const turbolinks = require("turbolinks-express")
const express = require('express');
const session = require('express-session')
const favicon = require('serve-favicon')
const flash = require("connect-flash")

function appUtils(app) {
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');
    //turbolinks
    app.use(turbolinks.redirect)
    app.use(turbolinks.location)
    //flash messages
    app.use(flash())

    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(lessMiddleware(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true, secure: true }));

    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = appUtils