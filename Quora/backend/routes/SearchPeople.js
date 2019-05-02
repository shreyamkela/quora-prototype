var express = require("express");
var router = express.Router();

// Route to GET people according to the search term
router.get("/", function(req, res) {
  console.log("GET /searchPeople");
  console.log("Req: ", req.query);
  res.status(200).send("SUCCESS - Search people");
});

module.exports = router;
