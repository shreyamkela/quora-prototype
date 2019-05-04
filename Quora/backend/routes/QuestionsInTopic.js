var express = require("express");
var router = express.Router();
const Model = require("../database/connection");

// Route to GET all questions for a topic id
router.get("/", function (req, res) {
    console.log("GET /questionsInTopic", req.query);
    Model.topics.findOne({ _id: req.query.topicId }, (err, results) => {
        if (err) {
            console.log("Unable to fetch topics", err);
            res.status(400).send("Unable to fetch topics!");
        } else {
            if (results) {
                console.log("results", results)
                Model.Questions.find({
                    '_id': { $in: results.questionIds }
                }, (err, results_questions) => {
                    if (err) {
                        console.log("Unable to fetch questions", err);
                        res.status(400).send("Unable to fetch questions!");
                    } else {
                        console.log("results_questions", results_questions)

                        if (results_questions[0] !== undefined) {
                            res.status(200).send(results_questions);
                        } else {
                            console.log("No questions found in this topic!", err);
                            res.status(200).send("No questions found in this topic!");
                        }
                    }

                })
            }
            else {
                console.log("This topic not found in database!", err);
                res.status(400).send("This topic not found in database!");
            }
        }
    })
});

module.exports = router;
