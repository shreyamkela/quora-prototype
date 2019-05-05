var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');

//Route to Add an Bookmark to a answer
router.post('/',function(req,response){
    console.log("Inside Bookmark post Request");
    db.bookmark({a_id:req.query.answer_id,email_id:req.cookies.cookie_user}, function () {
        return response.status(200).json({ success: true, message: "Successfully added the bookmark" });
    }, function (err) {
            console.log(err)
        response.status(400).json({ success: false, message: "Unable to add bookmark" });
    });
    
});

//Route to get All bookmarks for a user
router.get('/', function (req, res) {
    console.log("Inside get bookmarks");
    db.getBookmarks(req.cookies.cookie_user, function (results) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(results))
    }, function (err) {
        res.status(400).json({ success: false, message: "Unable to fetch bookmarks" });
    });
})

module.exports = router