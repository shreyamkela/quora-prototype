var express = require("express");
var router = express.Router();
var Profile = require("../../Kafka/model/profile");

// Route to GET people according to the search term

router.get("/", function (req, res) {
  console.log("GET /searchPeople");
  console.log("Req Search Key: ", req.query[0]);

  let searchValue = req.query[0];
  let searchedTopics = [];

  Profile.find({ $or:[ {firstname : new RegExp(searchValue, 'i') }, {lastname : new RegExp(searchValue, 'i') } ]}, (err, results) => {
    if (err) {
      console.log("Unable to fetch topics", err);
      res.status(400).send("Unable to fetch topics!");
    } else {
      if (results) {
        //console.log(JSON.stringify(results))
        searchedTopics = results;
        if (searchedTopics === []) {
          console.log("No People found with the entered search term!");
          res.status(400).send("NO_SUCH_PERSON");
        } else {
          console.log("Seach Sending searchedPeople: ", JSON.stringify(searchedTopics));
          res.status(200).send(searchedTopics);
          //res.status(200).send("SUCCESS");
        }

        //res.status(200).end("Course already enrolled!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
      } else {
        console.log("No People found in database!", err);
        res.status(400).send("NO_SUCH_PERSON");
      }
    }
  });
});

module.exports = router;
