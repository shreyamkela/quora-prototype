var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');
var kafka = require('../kafka/client');

//Route to Add an Answer to a question
router.post('/',function(req,response){
    console.log("Inside Add Answer Post Request");
    db.addAnswer({q_id:req.query.question_id,answer:req.body.answer,email_id:req.body.email_id}, function () {
        return response.status(200).json({ success: true, message: "Successfully added the answer" });
    }, function (err) {
        response.status(400).json({ success: false, message: "Unable to add answer" });
    });
    
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