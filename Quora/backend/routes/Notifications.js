var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');
//var Messages = require("../../Kafka/model/messages.js");

//Route to get all messages
router.get('/',function(request,response){
    var email_id = request.query.email_id;
    console.log("Viewer Email: "+email_id);  
    db.getNotifications(email_id, function(result){
        console.log("result: "+JSON.stringify(result));
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        response.end(JSON.stringify(result))

    }, function(err){
        console.log("error: "+err);
        response.status(400).json({ success: false, message: "Unable to retrieve notifications" });

    })

})


//route to send messages
router.post('/',function(request, response) {

    console.log("post notification");
    var email = request.body.email;
    var qid = request.body.qid;
    var notifications = request.body.notifications;
    console.log("email: "+email);
    console.log("qid: "+qid);
    console.log("notifications: "+notifications);

    db.updateNotifications({email:email,qid:qid,notifications:notifications}, function(){
        return response.status(200).json({ success: true, message: "Successfully updated the details" });
    }, function (err) {
        response.status(400).json({ success: false, message: "Unable to update details" });
    });
})
module.exports = router;
