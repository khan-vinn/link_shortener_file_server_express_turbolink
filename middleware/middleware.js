const { Link, File } = require("../models")

function ensureNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash("error", "Please login or sign up to coninue")
    res.redirect("/auth")
}

function findUserLinksFiles(id) {
    const linkFind = Link.find({ _lord: id }).catch(e => [])
    const fileFind = File.find({ _lord: id }).catch(e => [])
    return Promise.all([linkFind, fileFind])
}

function ensureFromAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        req.flash("error", "You will login to app/ please logout to continue")
        return res.redirect("/")
    }
    next()
}

function flashMessageProvideToRender(req, res, next) {
    const succ = req.flash("success")
    const err = req.flash("error")
    if (succ.length > 0 && err.length > 0) {
        res.locals.flash = ({ "error": err, "success": succ })
    } else if (succ && succ.length > 0) {
        res.locals.flash = ({ "success": succ })
    } else if (err && err.length > 0) {
        res.locals.flash = ({ "error": err })
    }
    next()
}

module.exports = { ensureNotAuthenticated, findUserLinksFiles, ensureFromAuthenticated, flashMessageProvideToRender }