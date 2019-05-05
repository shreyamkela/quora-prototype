var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');

//Route to update an Answer to a question
router.post('/',function(req,response){
    console.log("Inside Update Answer Post Request");
    req.body.a_id = req.query.answer_id
    console.log(req.body)
    kafka.make_request('update_answer', req.body, function (err, msg) {
        if (err) {
            response.status(401).json({ success: false, message: msg });
        } else {
            return response.status(200).json({ success: true, message: msg });
        }
    })
});

module.exports = router