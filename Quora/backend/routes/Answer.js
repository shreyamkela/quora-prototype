var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');
var kafka = require('../kafka/client');

//Route to Add an Answer to a question
router.post('/', function (req, response) {
    console.log("Inside Add Answer Post Request");
    req.body.q_id = req.query.question_id
    req.body.email_id = req.cookies.cookie_user
    kafka.make_request('add_answer', req.body, function (err, msg) {
        if (err) {
            response.status(401).json({ success: false, message: msg });
        } else {
            return response.status(200).json({ success: true, message: msg });
        }
    })
});

//Route to get All answers for a given question
router.get('/', function (req, res) {
    console.log("Inside get Answers");
    console.log("Req:", req.query)
    kafka.make_request('fetch_answers', req.query.question_id, function (err, results) {
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