var express = require('express')
var router = express.Router();
var kafka = require('../kafka/client');
var db = require('../../Kafka/app/db');
const Model = require("../database/connection");
var mongoose = require('mongoose');

// POST route to Add a new question
router.post('/', function (req, res) {
    console.log("POST /questions - Add a new question: ", req.body);
    // First add the question into the questions collection
    // Then add the topics to this question document

    //function for creating activity records for User Content
    let addActivityRecord = (type, q_id, user_id) => {
        Model.Activity.create({
          type: type,
          question: q_id,
          user_id:user_id,
          year: new Date().getFullYear()
        }).then(() =>{return})
      }

    // Adding the question
    Model.Questions.create({
        author: req.body.email,
        question: req.body.question,
        topics: req.body.topicTitles,
        timestamp: Date.now(),
        answers: [],
        followers: []
    }, (err, results) => {
        if (err) {
            console.log("Unable to insert question!", err);
            res.status(400).send("Unable to insert question!");
        } else {
            let questionId = results._id
            addActivityRecord('You asked',questionId,req.body.email)
            console.log("Activity added for Question asked");
            // Add the topics to this question document
            Model.topics.find({
                'title': { $in: results.topics }
            }, (err, results_topics) => {
                if (err) {
                    console.log("Unable to fetch topics", err);
                    res.status(400).send("Unable to fetch topics!");
                } else {
                    if (results_topics) {
                        console.log("XXXXXXXXXX", results_topics)
                        for (const obj of results_topics) {
                            obj.questionIds.push(questionId.toString())
                            obj.save().then(
                                doc => {
                                    console.log("New details added to this topic's questionIds");
                                },
                                err => {
                                    console.log("Unable to save topic details!", err);
                                    res.status(400).send("Unable to save topic details!");
                                }
                            );
                        }
                        res.status(200).send("Question added!");


                    } else {
                        console.log("These topics not found in database!", err);
                        res.status(400).send("These topics not found in database!");
                    }
                }



            });
        }
    })

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