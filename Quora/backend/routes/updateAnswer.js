var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');

//Route to update an Answer to a question
router.post('/',function(req,response){
    console.log("Inside Update Answer Post Request");
    req.body.a_id = req.query.answer_id
    console.log(req.body)
    db.updateAnswer(req.body, function () {
        return response.status(200).json({ success: true, message: "Successfully updated the answer" });
    }, function (err) {
        response.status(400).json({ success: false, message: "Unable to update answer" });
    });
    
});

module.exports = router