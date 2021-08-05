const express = require('express');
const multer = require("multer");

const { File } = require('../models');
const { ensureNotAuthenticated } = require('./middleware');
const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.get("/", ensureNotAuthenticated, (req, res, next) => {
    const succ = req.flash("success")
    const err = req.flash("error")
    const flashMessages = () => {
        if (succ.length > 0 && err.length > 0) {
            return ({ "error": err, "success": succ })
        } else if (succ.length > 0) {
            return ({ "success": succ })
        } else if (err.length > 0) {
            return ({ "error": err })
        }
    }
    res.render("file/form", { flash: flashMessages() })
})

router.post("/", ensureNotAuthenticated, upload.single("file"), (req, res) => {
    const file = req.file
    File.create({
        original_name: file.originalname,
        sys_name: file.filename,
        type: file.mimetype,
        full_path: file.path,
        size: file.size,
        _lord: req.user._id,
    }, (error, file) => {
        if (error) {
            req.flash("error", error)
            res.redirect("/f")
        } else if (!file) {
            req.flash("error", "Error on save file")
            res.redirect("/f")
        } else {
            req.flash("success", "File saved successfully")
            return res.redirect(`/f/${file.short_name}/view`)
        }
    })
})

router.get("/:id/view", (req, res, next) => {
    File.findOne({ short_name: req.params.id }, (error, doc) => {
        if (error) {
            req.flash("error", error)
            res.redirect("/404")
        } else if (!doc) {
            req.flash("error", "File not found")
            res.redirect("/404")
        } else {
            return res.render("file/elem", {
                file_h: {
                    name: doc.original_name,
                    date: doc.created_at,
                    size: doc.size,
                    type: doc.type,
                    link: doc.short_name
                },
            })
        }

    })
})

router.get("/:id/stats", (req, res, next) => {
})

router.get("/:id", (req, res, next) => {
    File.findOne({ short_name: req.params.id }, (error, file) => {
        if (error) {
            req.flash("error", error)
            res.redirect("/404")
        } else if (!file) {
            req.flash("error", "File not found")
            res.redirect("/404")
        }
        res.download(file.full_path, file.original_name)
    })
})

module.exports = router;