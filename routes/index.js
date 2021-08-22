const express = require('express');
const { Link, File, User } = require('../models');
const { flashMessageProvideToRender, findUserLinksFiles, ensureNotAuthenticated } = require('../middleware/middleware');
const router = express.Router();

router.get('/', flashMessageProvideToRender, ensureNotAuthenticated, function (req, res) {
  findUserLinksFiles(res.locals.user._id)
    .then(data => res.render("users/personal-page", { links: data[0], files: data[1] }))

});

router.get('/@:id?', function (req, res, next) {
  if (req.params.id && typeof (req.params.id) === "string" && req.params.id.length > 5) {
    User.findOne({ username: req.params.id }, (err, user) => {
      if (err) {
        req.flash("error", "error to find accaunt with this username")
        return res.redirect("/")
      } if (!user) {
        req.flash("error", "Dont find account username with this/ try another")
        req.flash("success", "You can register with this username, it's free")
        return res.redirect("/")
      }
      findUserLinksFiles(user._id)
        .then(data => res.render("users/id", { visitUser: user, links: data[0], files: data[1] }))
    })
  } else {
    req.flash("error", "try another @username")
    res.redirect("/")
  }
});

router.get("/community", (req, res) => {
  User.find({})
    .then(users => res.render("users/index", { users }))
})
router.get("/performance", (req, res) => {
  res.send("good job")
})
router.get("/dashboard", ensureNotAuthenticated, flashMessageProvideToRender, (req, res) => {
  findUserLinksFiles(req.user._id)
    .then(data => res.render("users/dashboard", { files: data[1], links: data[0] }))
})

module.exports = router;