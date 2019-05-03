const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

// Route to GET all topics followed for an email
router.get("/", function(req, res) {
  console.log("GET /topicsFollowed");
  console.log("Req: ", req.query);
  res.status(200).send("SUCCESS - Topics followed");
});

module.exports = router;
