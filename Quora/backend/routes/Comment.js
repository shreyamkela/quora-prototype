var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');

//Route to Add an Answer to a question
router.post('/', function (req, response) {
    console.log("Inside Add Comment Post Request");
    req.body.a_id = req.query.answer_id
    req.body.email_id = req.cookies.cookie_user
    kafka.make_request('answer_comment', req.body, function (err, msg) {
        if (err) {
            response.status(401).json({ success: false, message: msg });
        } else {
            return response.status(200).json({ success: true, message: msg });
        }
    })
});

module.exports = router