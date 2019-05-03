// Mongoose Setup - MongoDB - ORM
const mongoose = require("mongoose");

//mongoose.Promise = global.Promise;
let uri = "mongodb+srv://canvas_user:2407Rakhee%21@cluster0-jjkgt.mongodb.net/quoradb?poolSize=10?retryWrites=true";
mongoose.connect(uri, { useNewUrlParser: true, poolSize: 5 });
let con1 = mongoose.connection;
con1.on("error", console.error.bind(console, "connection error:"));
con1.once("open", function() {
  console.log("Connected");
});
var AutoIncrement = require("mongoose-sequence")(mongoose);
