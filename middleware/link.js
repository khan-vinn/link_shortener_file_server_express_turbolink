function linkIdParamsValidate(req, res, next) {
    const { id } = req.params
    if (id && typeof (id) === "string" && id.length > 5) {
        return next()
    }
    req.flash("error", "Link should be represent and valid")
    res.redirect("/404")
}

module.exports = { linkIdParamsValidate }