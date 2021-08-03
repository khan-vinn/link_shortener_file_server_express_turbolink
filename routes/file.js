const express = require('express');
const multer = require("multer");

const { File } = require('../models');
const { ensureNotAuthenticated } = require('./middleware');
const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.get("/", ensureNotAuthenticated, (req, res, next) => {
    res.render("file/form")
})

router.post("/", ensureNotAuthenticated, upload.single("file"), (req, res) => {
    const file = req.file
    console.log(file)
    File.create({
        original_name: file.originalname,
        sys_name: file.filename,
        type: file.mimetype,
        full_path: file.path,
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
    File.findOne({ short_name: req.params.id }, (err, doc) => {
        if (err) {
            return res.render("error", {
                message: `Something was wrong to find file with id ${req.parmas.id}`,
                error: {
                    status: 500,
                    stack: err
                }
            })
        } else if (!doc) {
            return res.render("error", {
                message: `not Found file with id ${req.parmas.id}`,
                error: {
                    status: 404,
                    stack: "no file with this id"
                }
            })
        }
        return res.render("file/index", {
            file_h: {
                name: doc.original_name,
                date: doc.created_at,
                size: doc.size,
                type: doc.type,
                link: doc.short_name
            },
        })

    })
})

router.get("/:id", (req, res, next) => {
    res.download(req.params.id)
})

module.exports = router;