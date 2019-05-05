var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');

//Route to get All answers for a given question
router.get('/', function (req, res) {
    console.log("Inside get top Answers");
    console.log("Req:", req.cookies.cookie_user)
    kafka.make_request('top_upanswers', req.cookies.cookie_user, function (err, results) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'application/json'
            })
            console.log(err)
            res.end(results)
        } else {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            res.end(JSON.stringify(results));
        }
    })
})

module.exports = router