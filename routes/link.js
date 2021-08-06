const express = require('express');
const { ensureNotAuthenticated, flashMessageProvideToRender } = require('./middleware');
const router = express.Router();

router.route("/")
    .get(flashMessageProvideToRender,
        ensureNotAuthenticated,
        (req, res, next) => {
            res.send("Will render link crate form")
        })
    .post(ensureNotAuthenticated,
        (req, res, next) => {
            if (typeof (req.body.link) === "string" && (req.body.link.length > 5)) {
                next()
            }
        }, (req, res, next) => { })

router.get("/:id", (req, res, next) => { })

router.get("/:id/stats", ensureNotAuthenticated, (req, res, next) => { })

module.exports = router;