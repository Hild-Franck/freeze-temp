"use strict";

var express = require('express');
var app = express();
var morgan = require('morgan');
var compress = require('compression');
var http = require('http');
var path = require('path');
var cors = require('cors');

app.use(compress());

app.use(morgan('dev'));

app.use('/api', require('./server/routes'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../index.html'));
})

app.use(cors());

app.set('json spaces', 2);

var server = http.createServer(app);

module.exports = server;