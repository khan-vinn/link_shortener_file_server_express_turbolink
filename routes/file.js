const express = require('express');
const multer = require("multer");

const { File, Visit } = require('../models');
const { ensureNotAuthenticated, flashMessageProvideToRender } = require('./middleware');
const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.get('/',
    ensureNotAuthenticated, flashMessageProvideToRender,
    (req, res) => {
        res.render("files/form")
    })

router.post('/', ensureNotAuthenticated, upload.single("file"), (req, res) => {
    const file = req.file
    File.create({
        original_name: file.originalname,
        sys_name: file.filename,
        type: file.mimetype,
        full_path: file.path,
        size: file.size,
        _lord: req.user._id
    })
        .then(doc => {
            if (doc) {
                req.flash("success", "File saved successfully")
                return res.redirect(`/f/${file.short_name}/view`)
            } else {
                req.flash("error", "Error on save file")
                return res.redirect("/f")
            }
        }).catch(error => {
            req.flash("error", `${error.name} :: ${error.message}`)
            return res.redirect("/f")
        })
})

router.get("/:id/view", flashMessageProvideToRender, (req, res, next) => {
    File.findOne({ short_name: req.params.id })
        .then(doc => {
            if (!doc) {
                req.flash("error", "File not found")
                return res.redirect("/404")
            } else if (doc) {
                return res.render("files/elem", {
                    file_h: {
                        name: doc.original_name,
                        date: doc.createdAt,
                        size: doc.size,
                        type: doc.type,
                        link: doc.short_name,
                        uploads: doc.download_count
                    },
                })
            } else {
                return res.end()
            }
        })
        .catch(error => {
            req.flash("error", `${error.name} :: ${error.message}`)
            return res.redirect("/404")
        })
})

router.get("/:id/stats", (req, res, next) => {
    res.send("will render file statistics")
})

router.get("/:id", (req, res, next) => {
    let fileVisits;
    File.findOneAndUpdate({ short_name: req.params.id },
        { $inc: { download_count: 1 } },
        { new: true, timestamps: false })
        .then(doc => {
            if (!doc) {
                req.flash("error", "File not found")
                res.redirect("/404")
            } else if (doc) {
                fileVisits = doc;
                return Visit.create({
                    belongs_to: file._id,
                    ip_addr: req.ip,
                    client: req.get("user-agent"),
                    lang: req.header("accept-language")
                })

            }
        })
        .then(() => res.download(fileVisits.full_path, fileVisits.original_name))
        .catch(error => {
            req.flash("error", `${error.name} :: ${error.message}`)
            return res.redirect("/404")
        })
})

module.exports = router;
