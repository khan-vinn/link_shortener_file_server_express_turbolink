const express = require('express');
const { ensureNotAuthenticated } = require('./middleware');
const router = express.Router();

/* GET home page. */
router.get('/', ensureNotAuthenticated, function (req, res, next) {
  console.log(req.flash("info"))
  res.render('index', { title: 'Express' });
});

module.exports = router;
