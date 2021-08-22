const { File } = require("../models")

async function fileExistChecker(req, res, next) {
    try {
        const fileShortLink = req.params.id
        console.log(fileShortLink)
        if (fileShortLink && fileShortLink.length > 0) {
            const file = await File.findOne({ short_name: fileShortLink })
            if (file) {
                console.log(file)
                res.locals.file = file
                return next()
            } else {
                req.flash("error", "File Not Found")
                return res.redirect("/")
            }
        } else {
            res.locals.file = {}
            return next()
        }
        next()
    } catch (error) {
        req.flash("error", "Check your params")
        req.flash("error", `${error.name} ${error.message}`)
        return res.redirect("/")
    }
}

module.exports = { fileExistChecker }