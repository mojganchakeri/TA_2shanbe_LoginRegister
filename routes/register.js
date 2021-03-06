/**
 * Created by Mojgan on 16/10/12.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongodb = require('mongodb');
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';

/* GET home page. */

router.get('/', function(req, res, next) {
    res.writeHead(200,{'Content_Type':'text/html'});
    fs.readFile('./register_form.html',null,function (error , data) {
        if(error){
            res.write("Page Not Found!")
        }
        else {
            res.write(data);
        }
        res.end();
    })
});
router.post('/submit',function (req , res , next) {
    /*console.log('in post function');
     console .log(req.param('username'));
     console.log(req.param('password'));
     */
    var item = {
        username : req.body.username,
        email : req.body.email,
        contact_no : req.body.number,
        password : req.body.password
    };

    mongodb.connect(url , function (err , db) {
        assert.equal(null , err);
        db.collection('user-data').insertOne(item , function(err , data){
            assert.equal(null , err);
            console.log('data inserted!');
            console.log(item.username);
            console.log(item.email);
            console.log(item.contact_no);
            db.close();
        });
    });
    res.redirect('/');
});

router.get('/get-data',function (req,res,next) {
    var result_array =[];
    mongodb.connect(url , function (err , db) {
        assert.equal(null , err);
        var cursor = db.collection('user-data').find();
        cursor.forEach(function (doc , err) {
            assert.equal(null , err);
            result_array.push(doc);
        },function () {
            db.close();
            res.json(result_array);
        });
    });
});
module.exports = router;
