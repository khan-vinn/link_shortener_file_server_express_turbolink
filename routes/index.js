const express = require('express');
const { Link, File, User } = require('../models');
const { flashMessageProvideToRender, ensureNotAuthenticated } = require('../middleware/middleware');
const router = express.Router();

router.get('/', flashMessageProvideToRender, ensureNotAuthenticated, function (req, res, next) {
  Link.find({ _lord: req.user._id }, (err, links) => {
    if (err) {
      console.log(err)
    }
    File.find({ _lord: req.user._id }, (err, files) => {
      if (err) {
        console.log(err)
      }
      res.render("users/personal-page", { user: req.user, links, files, login: true });
    })
  })
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
      Link.find({ _lord: user._id }, (err, links) => {
        if (err) {
          console.log(err)
        }
        File.find({ _lord: user._id }, (err, files) => {
          if (err) {
            console.log(err)
          }
          res.render("users/personal-page", { user, links, files });
        })
      })
    })
  } else {
    req.flash("error", "try another @username")
    res.redirect("/")
  }
});

router.get("/users", (req, res) => {
  res.send("Should show all users")
})

module.exports = router;