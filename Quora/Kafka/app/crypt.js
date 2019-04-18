'use strict';
var bcrypt = require('bcrypt-nodejs');

var crypt = {};

crypt.createHash = function (data, successCallback, failureCallback) {
    console.log(data)
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            console.log("Error in gen salt")
            failureCallback(err);
            return;
        }
        bcrypt.hash(data, salt, null, function (err, hash) {
            if (err) {
                console.log("Error in hash")
                failureCallback(err);
                return;
            }
            console.log(hash.length)
            successCallback(hash);
        });
    });
};

crypt.compareHash = function (data, encrypted, successCallback, failureCallback) {
    console.log(data)
    bcrypt.compare(data, encrypted, function (err, isMatch) {
        if (err) {
            console.log("Error in compare")
            console.log(err)
            failureCallback(err);
            return;
        }
        console.log(data)
        successCallback(isMatch);
    });
};

module.exports = crypt;