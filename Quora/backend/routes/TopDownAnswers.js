var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');

//Route to get All answers for a given question
router.get('/', function (req, res) {
    console.log("Inside get top 5 downvoted Answers");
    console.log("Req:", req.cookies.cookie_user)
    db.getTopDownAnswers(req.cookies.cookie_user, function (results) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(results))
    }, function (err) {
        res.status(400).json({ success: false, message: "Unable to retrieve answers" });
    });
})

module.exports = router