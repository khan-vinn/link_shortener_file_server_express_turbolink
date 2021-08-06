const express = require('express');
const { ensureNotAuthenticated } = require('./middleware');
const router = express.Router();

router.get('/', ensureNotAuthenticated, function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/@:id?', function (req, res, next) {
  res.render('index', { title: req.params.id || 'Default User' });
});

router.get("/users", (req, res) => {
  res.send("Should show all users")
})

module.exports = router;