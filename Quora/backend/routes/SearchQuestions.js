var express = require("express");
var router = express.Router();
const Model = require("../database/connection");


// Route to GET questions according to the search term

router.get("/", function (req, res) {
    console.log("GET /searchQuestions");
    console.log("Req: ", req.query[0].toLowerCase());

    let searchValue = req.query[0].toLowerCase();
    let searchedQuestions = [];
    Model.Questions.find({}, (err, results) => {

        if (err) {
            console.log("Unable to fetch questions", err);
            res.status(400).send("Unable to fetch questions!");
        } else {
            if (results) {
                for (var key in results) {

                    let currentTerm = results[key].question.toLowerCase();
                    if (currentTerm.includes(searchValue)) {
                        searchedQuestions.push(results[key]);
                    }
                }
                if (searchedQuestions === []) {
                    console.log("No questions found");
                    res.status(400).send("No questions found");
                } else {
                    console.log("searchedQuestions: ", searchedQuestions);
                    res.status(200).send(searchedQuestions);
                }
            } else {
                console.log("No Questions found in database!", err);
                res.status(400).send("No Questions found in database!");
            }
        }
    });
});

module.exports = router;
