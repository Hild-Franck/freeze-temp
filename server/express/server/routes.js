"use strict";
 
const express = require('express');
const router = express.Router();
const keypass = require('./utils/key');
var mongo = require('mongodb').MongoClient;
var serverMongo = 'mongodb://10.31.3.44:27017/ThermoFridge';
var serverMongoMaison = 'mongodb://192.168.0.27:27017/ThermoFridge';
var serverMongo2 = 'mongodb://groupe4:lacalotte@192.168.43.248:27017/ThermoFridge';

router.use('*', keypass);


router.get('/', function (req, res) {
  res.send('<p>/all</p><p>/groupe/:id</p>');
});


router.get('/all', function (req, res) {
  mongo.connect(serverMongo, function (err, db) {
    db.collection('sensors').find({}).sort({"time": -1}).limit(50).toArray()
    .then(function (numItems) {
      res.json({data: numItems.sort({"time": 1})});
    });
  });
});

router.get('/group/:id', function (req, res) {
  if (req.params.id) {
    mongo.connect(serverMongo, function (err, db) {
      db.collection('sensors').find({"name": `ingesupb2/${req.params.id}`}).sort({"time": -1}).limit(50).toArray()
        .then(function (numItems) {
          res.json({data: numItems.sort({"time": 1})});
        });
    });
  }
})

module.exports = router;