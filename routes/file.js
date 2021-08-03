const express = require('express');
const multer = require("multer");
const { ensureNotAuthenticated } = require('./middleware');
const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.get("/", ensureNotAuthenticated, (req, res, next) => {
    res.render("file", { form: true })
})

router.post("/", ensureNotAuthenticated, upload.single("file"), (req, res) => {
    req.flash("info", (req.file.path + " " + req.file.size + ' ' + req.file.mimetype))
    res.redirect("/")
})

router.get("/:id/view", (req, res, next) => {
    res.render("file", { filename: req.params.id, view: true })
})

router.get("/:id", (req, res, next) => {
    res.download(req.params.id)
})

module.exports = router;