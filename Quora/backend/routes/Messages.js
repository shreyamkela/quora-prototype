var express = require('express')
var router = express.Router();
var db = require('../../Kafka/app/db');
//var Messages = require("../../Kafka/model/messages.js");

//Route to get all messages
router.get('/',function(request,response){
    var email_id = request.query.email_id;
    var chats = [];
    console.log("Viewer Email: "+email_id);  
    db.showMessages(email_id, function(results){
        results.map(a => {
            // console.log("person1: "+a.person1);
            // console.log("person2: "+a.person2);
            // console.log("no of chats: "+a.chat.length);
            if(a.person1 === email_id){
                chats.push({chatWithName : a.person2Name,
                            chatWith : a.person2,
                            chat : a.chat
                })
            }
            else if(a.person2 === email_id){
                chats.push({chatWithName : a.person1Name,
                            chatWith : a.person1,
                            chat : a.chat
                })
            }
               
        })
        console.log("Chats: "+JSON.stringify(chats))
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        response.end(JSON.stringify(chats))
    }, function (err) {
        response.status(400).json({ success: false, message: "Unable to retrieve messages" });
    });

})


//route to send messages
router.post('/',function(request, response) {

    console.log("post message creation");
    var sender = request.body.sender;
    var receiver = request.body.receiver;
    var message = request.body.message;
    var time = request.body.time;
    console.log("sender: "+request.body.sender);
    console.log("Receiver: "+receiver);
    console.log("Message: "+message);

    db.sendMessage({sender:request.body.sender,receiver:request.body.receiver,message: request.body.message, time : request.body.time}, function(){
        return response.status(200).json({ success: true, message: "Successfully updated the answer" });
    }, function (err) {
        response.status(400).json({ success: false, message: "Unable to update answer" });
    });
})
module.exports = router;
