function ensureNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash("error", "Please login or sign up to coninue")
    res.redirect("/auth")
}
function ensureFromAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        req.flash("error", "You will login to app/ please logout to continue")
        return res.redirect("/")
    }
    next()
}

module.exports = { ensureNotAuthenticated, ensureFromAuthenticated }