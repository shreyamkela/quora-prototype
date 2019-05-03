const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

// Route to GET all topics followed for an email
router.get("/", function (req, res) {
  console.log("GET /topicsFollowed");
  console.log("Req: ", req.query);

  Model.profile.find({ email: req.query.email }, (err, results) => {
    if (err) {
      console.log("Unable to fetch user profile", err);
      res.status(400).send("Unable to fetch user profile!");
    } else {
      if (results) {
        //console.log(results)
        if (req.query.type === "1") { // For fetching all topics followed

        } else if (req.query.type === "2") { // For following a searched topic
          if (results[0].topicsFollowed.includes(req.query.topicId)) {
            res.status(200).send("Already followed!");
          } else {
            res.status(200).send("Topic followed!");
          }

        }

        // for (var key in results) {
        //   let currentTerm = results[key].title.toLowerCase();
        //   if (currentTerm.includes(searchValue)) {
        //     searchedTopics.push(results[key]);
        //   }
        // }
        // if (searchedTopics === []) {
        //   console.log("No topics found with the entered search term!");
        //   res.status(400).send("No topics found with the entered search term!");
        // } else {
        //   console.log("searchedTopics: ", searchedTopics);
        //   res.status(200).send(searchedTopics);
        //   //res.status(200).send("SUCCESS");
        // }

        //res.status(200).end("Course already enrolled!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
      } else {
        console.log("User not found in database!", err);
        res.status(400).send("User not found in database!");
      }
    }
  });

});

module.exports = router;
