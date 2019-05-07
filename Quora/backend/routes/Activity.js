var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');
var kafka = require('../kafka/client');

router.get('/', function (req, response) {
    console.log('in Get activity before kafka: ', req.cookies.cookie_user);
    kafka.make_request('activity',{email:req.cookies.cookie_user}, function(err,results){
    
        if (err) {
            response.writeHead(400, {
                'Content-Type': 'application/json'
            })
            console.log(err)
            response.end(results)
        } else {
            response.writeHead(200, {
                'Content-Type': 'application/json'
            })
            console.log("results: " + results)
            response.end(JSON.stringify(results));
        }

})
})
module.exports = router