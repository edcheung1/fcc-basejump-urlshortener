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
                var checkHttp = /^(http|https):\/\//;
                if(!checkHttp.test(link)) {
                    link = 'http://' + link;
                }
                
                testdb.find({'original_url': link}).count(function(err, count) {
                    if (err) {
                        throw err;
                    }
                    if(count == 0) {
                        getNextSequence('userid', function(seq) {
                            var shortUrl = 'https://fcc-timestamp-edcheung1.c9users.io/' + seq;
                            testdb.update(
                                {'original_url': link},
                                {'original_url': link, '_id': seq, 'short_url': shortUrl},
                                {
                                    upsert: true
                                }, function (err, docs) {
                                    if (err) {
                                        throw err;
                                    }
                                    res.send(JSON.stringify({'original_url': link, 'short_url': shortUrl}));
                            });
                        })
                    } else {
                        testdb.findOne({'original_url': link}, {'_id': 0}, function (err, docs) {
                            if (err) {
                                throw err;
                            }
                            if (docs) {
                                res.send(docs);
                            }
                        })
                    }
                });
            } else {
                res.send('Not a valid url');
            }
        });
        
    app.route('/*')
        .get(function (req,res) {
            var urlCode = parseInt(req.url.slice(1));
            testdb.findOne({'_id': urlCode}, function(err, result) {
                if(err) {
                    throw err;
                }
                if(result) {
                    res.writeHead(302, {
                      'Location': result.original_url
                      //add other headers here...
                    });
                    res.end();
                } else {
                    res.send('Cannot find given short url');
                }
            })
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

