'use strict';

var validator = require('validator');

module.exports = function (app, db) {
    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        });
        
    app.route('/new/*')
        .get(function (req,res) {
            var testdb = db.collection('testlinks');
            
            var link = req.url.slice(5);
            
            if(validator.isURL(link)) {
                testdb.insert({'original_url': link, }, function(err) {
                    if (err) {
                        throw err;
                    }
                    
                    testdb.find({}).toArray(function(err, docs) {
                       if (err) {
                           throw err;
                       }
                       
                       if (docs) {
                           res.send(docs);
                       }
                    });
                    
                });
            } else {
                res.send('Not a valid url');
            }
        });
        
    app.route('/list')
        .get(function (req,res) {
            var testdb = db.collection('testlinks');
            
            testdb.find({}).toArray(function (err, docs) {
                if (err) {
                       throw err;
                   }
                   
                   if (docs) {
                       res.send(docs);
                   }
            });
        });
};

function isURL(str) {
  var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return pattern.test(str);
}