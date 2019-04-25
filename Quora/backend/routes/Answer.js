var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');

//Route to Add an Answer to a question
router.post('/',function(req,response){
    console.log("Inside Add Answer Post Request");
    db.addAnswer({q_id:req.query.question_id,answer:req.body.answer}, function () {
        return response.status(200).json({ success: true, message: "Successfully added the answer" });
    }, function (err) {
        response.status(400).json({ success: false, message: "Unable to add answer" });
    });
    
});

//Route to get All answers for a given question
router.get('/', function (req, res) {
    console.log("Inside get Answers");
    console.log("Req:", req.query)
    db.getAnswersByQuestionId(req.query.question_id, function (results) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(results))
    }, function (err) {
        response.status(400).json({ success: false, message: "Unable to add answer" });
    });
})

module.exports = router