function authParamsValidate(req, res, next) {
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
}

module.exports = { authParamsValidate }