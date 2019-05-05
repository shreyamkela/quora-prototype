var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');

//Route to Add an Bookmark to a answer
router.post('/',function(req,response){
    console.log("Inside Bookmark post Request");
    kafka.make_request('bookmark_answer',{a_id:req.query.answer_id,email_id:req.cookies.cookie_user}, function (err, msg) {
        if (err) {
            response.status(401).json({ success: false, message: msg });
        } else {
            return response.status(200).json({ success: true, message: msg });
        }
    })
    
});

//Route to get All bookmarks for a user
router.get('/', function (req, res) {
    console.log("Inside get bookmarks");
    kafka.make_request('fetch_bookmarks', req.cookies.cookie_user, function (err, results) {
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
    })
})

module.exports = router