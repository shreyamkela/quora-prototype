// Mongoose Setup - MongoDB - ORM
const mongoose = require("mongoose");

//mongoose.Promise = global.Promise;
let uri = "mongodb+srv://canvas_user:2407Rakhee%21@cluster0-jjkgt.mongodb.net/quoradb?poolSize=10?retryWrites=true";
mongoose.Promise = global.Promise;
mongoose.connect(uri, { useNewUrlParser: true, poolSize: 5 });
let con1 = mongoose.connection;
con1.on("error", console.error.bind(console, "Connection error in mongoose (backend folder): "));
con1.once("open", function() {
  console.log("Connected to mongoose - From backend folder");
});
var AutoIncrement = require("mongoose-sequence")(mongoose);

// NOTE - Have to keep all model schema declarations in the file where the above mongo/mongoose connections have been made,
// so that the connection is available to the below schema. If schema is kept in a different file then we have to export the connection configuration from here
// Topics Model
var topics = mongoose.model("topics", {
  title: String,
  questionIds: Array,
  followers: Array
});

module.exports = {
  topics
};
