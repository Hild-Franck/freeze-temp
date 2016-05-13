"use strict";
 
const express = require('express');
const router = express.Router();
const keypass = require('./utils/key'); 

router.use('*', keypass);


router.get('/', function (req, res) {
  res.send('<p>/all</p><p>/groupe/:id</p>');
});


router.get('/all', function (req, res) {
  
});

router.get('/groupe/:id')

module.exports = router;