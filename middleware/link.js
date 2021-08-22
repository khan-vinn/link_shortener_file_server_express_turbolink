const { Link } = require("../models")

function linkIdParamsValidate(req, res, next) {
    const { id } = req.params
    if (id && typeof (id) === "string" && id.length > 5) {
        return next()
    }
    req.flash("error", "Link should be represent and valid")
    res.redirect("/404")
}

async function linkExistChecker(req, res, next) {
    try {
        const shortLink = req.params.id
        if (shortLink && shortLink.length > 0) {
            const link = await Link.findOne({ short_link: shortLink })
            if (link) {
                res.locals.link = link
                return next()
            } else {
                req.flash("error", "Link Not Found")
                return res.redirect("/")
            }
        } else {
            res.locals.file = {}
            return next()
        }
        next()
    } catch {
        req.flash("error", "Check your params")
        return res.redirect("/")
    }
}

module.exports = { linkIdParamsValidate,linkExistChecker }