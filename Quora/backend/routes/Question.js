var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');

//Route to Add a question
router.post('/',function(req,response){
    console.log("Inside Add Question Post Request");
    db.addQuestion({
        q_id:req.query.question_id,
        question:req.body.question,
        author:req.body.email_id,
        topic:req.body.topic,
        timestamp: Date.now(),

    },  kafka.make_request('add_question',varObj, function(err,results){
        return response.status(200).json({ success: true, message: "Successfully added the question" });
    }, function (err) {
        response.status(400).json({ success: false, message: "Unable to add question" });
    }));

});


//more routes over here

module.exports = router