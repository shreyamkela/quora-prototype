//Get Mongo Client from mongodb library
var crypt = require('./crypt');
var db = {};
let mysql = require('mysql')
let con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'Quora_Db',
    multipleStatements:true
})
// Creating a new User and creating profile for the user
db.createUser = function (user, successCallback, failureCallback) {
    var passwordHash;
    console.log(user)
    crypt.createHash(user.password, function (res) {
        passwordHash = res;
        let sql = "INSERT INTO Users (Email, Password) VALUES ( " + mysql.escape(user.email_id) + " , " + mysql.escape(passwordHash) + " ); "
        con.query(sql, function (err, result) {
            if (err) {
                failureCallback(err)
            }
            else {
                successCallback()
            }
        })
    }, function (err) {
        console.log(err)
        failureCallback(err)
    });
}


db.findUser = function (user, successCallback, failureCallback) {
    let sql = "Select * from Users where Email = " + mysql.escape(user.email_id);
    con.query(sql, function (err, result) {
        if (err) {
           failureCallback(err)
        }
        if (result[0] === undefined) {
            failureCallback("User not found")
        }
        else {
           successCallback(result[0])   
        }
    })
}



module.exports = db;