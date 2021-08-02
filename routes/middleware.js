function ensureNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/auth")
}
function ensureFromAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}

module.exports = { ensureNotAuthenticated, ensureFromAuthenticated }