const express = require('express');
const multer = require("multer");

const { File } = require('../models');
const { ensureNotAuthenticated } = require('./middleware');
const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.get("/", ensureNotAuthenticated, (req, res, next) => {
    res.render("file", { form: true })
})

router.post("/", ensureNotAuthenticated, upload.single("file"), (req, res) => {
    const file = req.file
    File.create({
        original_name: file.originalname,
        sys_name: file.filename,
        size: file.size,
        _lord: req.user._id,
    }, (error, file) => {
        if (error) {
            return res.render("error", {
                message: "Database error on save",
                error: {
                    status: 500,
                    stack: error
                }
            })
        } else if (!file) {
            return res.render("error", {
                message: "Error on save file",
                error: {
                    status: 501,
                    stack: "something was wrong on save file information in database"
                }
            })
        }
        console.log(file)
        res.redirect("/")
    })
})

router.get("/:id/view", (req, res, next) => {
    res.render("file", { filename: req.params.id, view: true })
})

router.get("/:id", (req, res, next) => {
    res.download(req.params.id)
})

module.exports = router;