var mongoose = require('mongoose');


var profileSchema = mongoose.Schema({
firstname: {
    type: String
},
lastname: {
    type: String
},
email: {
    type: String
},
city: {
    type: String
},
state: {
    type: String
},
zipcode: {
    type: String
},
education: {
    type: String
},
career: {
    type: String
},
aboutme: {
    type: String
},
credentials: {
    type: String
},
photo: {
    type: String
},
views : [Date],
followers : [String],
following : [String],
topicsFollowed : Array,
questionsFollowed: [{qid : mongoose.Schema.Types.ObjectId, actualAnswers: Number, initialAnswers: Number}]
});

Profile = module.exports = mongoose.model('profile',profileSchema,'profiles');

module.exports = Profile;