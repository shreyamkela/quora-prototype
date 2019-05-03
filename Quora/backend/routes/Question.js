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

// //Route to get All questions by a given user
// router.get('/', function (req, res) {
//     console.log("Inside get Questions");
//     req.body.email_id = req.cookies.cookie_user
//     console.log("Req:", req.query)
//     db.getQuestionByEmail(req.body.email_id, function (results){
//         res.writeHead(200,{
//             'Content-type': 'application/JSON'
//         })
//         res.end(JSON.stringify(results))
//     }, function (err) {
//         res.status(400).json({ success: false, message: "Unable to fetch questions" });
//     }),
//
//     kafka.make_request('fetch_questions', req.body.email_id, function (err, results) {
//         if (err) {
//             res.writeHead(400, {
//                 'Content-Type': 'application/json'
//             })
//             console.log(err)
//             res.end(results)
//         } else {
//             res.writeHead(200, {
//                 'Content-Type': 'application/json'
//             })
//             res.end(JSON.stringify(results));
//         }
//     }
//     )
// })
//more routes over here

module.exports = router