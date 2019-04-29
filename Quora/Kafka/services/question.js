var db = require("../app/db");
var config = require('../../backend/config/settings');

function handle_request(msg, callback) {
    // Attempt to save the user
    db.createQuestion(msg, function (res) {
        const newQuestion = new Profile({
            //    _id: new mongoose.Types.ObjectId(),
            question: msg.question,
            topic: msg.topic,
            author: msg.email_id,
            timestamp: Date.now(),
        })

        console.log("mongo update")
        newQuestion
            .save()
            .then(result => {
                console.log("result of query" + result)
            })
            .catch(err => {
                console.log("first error" + err);

                callback(err,'Problem in creating Question in mongodb.');

            })

        callback(null, { msg: 'Successfully created new question.' });
    }, function (err) {
        callback(err,'Some error in creating question');
    });

};

exports.handle_request = handle_request;