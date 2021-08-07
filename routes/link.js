const express = require('express');
const { ensureNotAuthenticated, flashMessageProvideToRender } = require('./middleware');
const router = express.Router();

router.get("/", flashMessageProvideToRender,
    ensureNotAuthenticated,
    (req, res, next) => {
        res.send("Will render link create form")
    })

router.post("/", ensureNotAuthenticated,
    (req, res, next) => {
        if (typeof (req.body.link) === "string" && (req.body.link.length > 5)) {
            next()
        }
    },
    (req, res, next) => {
        res.send("will post link")
    })

router.get("/:id", (req, res, next) => {
    res.send("will redirect to original link")
})

router.get("/:id/stats",
    ensureNotAuthenticated,
    (req, res, next) => {
        res.send("Will render statistic of link")
    })

module.exports = router;
