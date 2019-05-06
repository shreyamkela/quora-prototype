var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');

//Route to get All answers for a given question
router.get('/', function (req, res) {
    // console.log("Inside get User Answers");
    // console.log("Req:", req.query)
    kafka.make_request('user_answers', req.cookies.cookie_user, function (err, results) {
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