"use strict";

var express = require('express');
var app = express();
var morgan = require('morgan');
var compress = require('compression');
var http = require('http');

app.use(compress());

app.use(morgan('dev'));

// app.use(express.static(__dirname + '/public'));

app.use('/api', require('./server/routes'));

var server = http.createServer(app);

module.exports = server;