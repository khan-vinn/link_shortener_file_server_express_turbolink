const express = require('express');
const { Link, File } = require('../models');
const { ensureNotAuthenticated } = require('./middleware');
const router = express.Router();

router.get('/', ensureNotAuthenticated, function (req, res, next) {
  Link.find({ _lord: req.user._id }, (err, links) => {
    if (err) {
      console.log(err)
    }
    File.find({ _lord: req.user._id }, (err, files) => {
      if (err) {
        console.log(err)
      }
      res.render("users/personal-page", { user: req.user, links, files });
    })
  })
});

router.get('/@:id?', function (req, res, next) {
  res.render('index', { title: req.params.id || 'Default User' });
});

router.get("/users", (req, res) => {
  res.send("Should show all users")
})

module.exports = router;