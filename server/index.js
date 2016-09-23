'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// lib
const path = require('path');

// express dep
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

// express init
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.resolve(__dirname, '../web/dist')));

const mongo = require('iblokz').adapters.mongo;
const db = mongo.connect('mongodb://localhost');

require('./api')(app, db);

app.listen(8080);

console.log('Express app started on port ' + 8080);
