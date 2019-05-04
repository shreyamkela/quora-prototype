var express = require("express");
var router = express.Router();
const Model = require("../database/connection");

// Route to GET all topics
router.get("/", function (req, res) {
    console.log("GET /fetchAllTopics");
    Model.topics.find({}, (err, results) => {
        if (err) {
            console.log("Unable to fetch topics", err);
            res.status(400).send("Unable to fetch topics!");
        } else {
            if (results) {
                res.status(200).send(results);
            }
            else {
                console.log("No topics found in database!", err);
                res.status(400).send("No topics found in database!");
            }
        }
    })
});

module.exports = router;
