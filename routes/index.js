const express = require('express');
const { ensureNotAuthenticated } = require('./middleware');
const router = express.Router();

/* GET home page. */
router.get('/', ensureNotAuthenticated, function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/@:id', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
module.exports = router;
