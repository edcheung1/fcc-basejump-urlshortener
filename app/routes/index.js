'use strict';

var validator = require('validator');

module.exports = function (app, db) {
    var testdb = db.collection('testlinks');
    var counterdb = db.collection('counters');
    
    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
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
        
    app.route('/new/*')
        .get(function (req,res) {
            var link = req.url.slice(5);
            if(validator.isURL(link)) {
                testdb.find({'original_url': link}).count(function(err, count) {
                    if (err) {
                        throw err;
                    }
                    if(count == 0) {
                        getNextSequence('userid', function(seq) {
                            testdb.update(
                                {'original_url': link},
                                {'original_url': link, '_id': seq},
                                {
                                    upsert: true
                                }, function (err) {
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
                        })
                    } else {
                        res.send('Link already exists');
                    }
                });
            } else {
                res.send('Not a valid url');
            }
        });
        
    app.route('/*')
        .get(function (req,res) {
            var urlCode = req.url.slice(1);
            res.send(urlCode);
        });
        
    function getNextSequence(name, callback) {
        var ret = counterdb.findAndModify(
            { _id: name },
            [],
            { $inc: { seq: 1 } },
            {new: true, upsert: true},
            function(err, result) {
                if (err) {
                    throw err;
                }
                callback(result.value.seq);
            }
        )
    }
};

function isURL(str) {
  var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return pattern.test(str);
}

