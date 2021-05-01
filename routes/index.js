const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
  res.render('index');
  console.log(process.env.DATABASE_URL)
});

module.exports = router;
