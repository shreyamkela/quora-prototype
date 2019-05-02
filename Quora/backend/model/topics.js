var mongoose = require("mongoose");

var topics = mongoose.model("topics", {
  topicId: String,
  email: String,
  title: String,
  questionIds: Array,
  followers: Array
});

module.exports = {
  topics
};
