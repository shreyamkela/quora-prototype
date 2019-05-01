var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');

//Route to upvote an  answer
router.post('/',function(req,response){
    console.log("Inside follow post Request");
    console.log(req.body)
    db.addFollower({target_email:req.body.target_email, my_email:req.body.my_email}, function () {
        return response.status(200).json({ success: true, message: "Successfully Added Follower" });
    }, function (err) {
            console.log(err)
        response.status(400).json({ success: false, message: "Unable to follow" });
    });
    
});

module.exports = router