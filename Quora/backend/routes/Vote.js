var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');

//Route to upvote an  answer
router.post('/',function(req,response){
    console.log("Inside vote post Request");
    console.log(req.body)
    db.vote({a_id:req.query.answer_id,email_id:req.cookies.cookie_user,flag:req.body.flag}, function () {
        return response.status(200).json({ success: true, message: "Successfully voted the answer" });
    }, function (err) {
            console.log(err)
        response.status(400).json({ success: false, message: "Unable to vote" });
    });
    
});

module.exports = router