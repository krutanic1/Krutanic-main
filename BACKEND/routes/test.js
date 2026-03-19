const express = require("express");
const router = express.Router();

router.get('/test', (req, res) => {
    res.send('API is working successfully!');
  });

  module.exports = router;