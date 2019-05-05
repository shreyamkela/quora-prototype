var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');

//Route to upvote an  answer
router.post('/',function(req,response){
    console.log("Inside vote post Request");
    console.log(req.body)
    kafka.make_request('vote_answer', {a_id:req.query.answer_id,email_id:req.cookies.cookie_user,flag:req.body.flag}, function (err, msg) {
        if (err) {
            response.status(401).json({ success: false, message: msg });
        } else {
            return response.status(200).json({ success: true, message: msg });
        }
    })
    
});

module.exports = router