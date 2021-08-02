var express = require('express');
const passport = require("passport")
var router = express.Router();

router.get("/", (req, res) => {
    res.render("auth")
})
router.post("/signin",
    passport.authenticate('local', { failureRedirect: '/xxxx' }),
    (req, res) => {
        res.render("index")
    })
router.post("/signup", (req, res, next) => {
    res.send(`${req.body.username} ${req.body.password} ${req.body.con_password} ${req.body.password === req.body.con_password}`)
})

module.exports = router;