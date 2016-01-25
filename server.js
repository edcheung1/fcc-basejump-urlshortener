'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongo = require('mongodb').MongoClient;

var app = express();

app.set('port', (process.env.PORT || 5000));

mongo.connect('mongodb://localhost:27017/testdb', function (err, db) {
    if (err) {
        throw new Error('Database failed to connect.');
    } else {
        console.log('MongoDB successfully connected on port 27017.')
    }
    
    routes(app, db);

    app.listen(app.get('port'), function () {
        console.log('Node app is running on port ', app.get('port'));
    });
    
})

