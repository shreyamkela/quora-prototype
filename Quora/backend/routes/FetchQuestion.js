var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');

//Route to get All questions by a given user
router.get('/', function (req, res) {
    console.log("Inside get Questions");
    req.body.email_id = req.cookies.cookie_user
    console.log("Req:", req.query)
    db.getQuestionByEmail(req.body.email_id, function (results){
        res.writeHead(200,{
            'Content-type': 'application/JSON'
        })
        res.end(JSON.stringify(results))
    }, function (err) {
        res.status(400).json({ success: false, message: "Unable to fetch questions" });
    }),

        kafka.make_request('fetch_questions', req.body.email_id, function (err, results) {
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
            }
        )
})


module.exports = router