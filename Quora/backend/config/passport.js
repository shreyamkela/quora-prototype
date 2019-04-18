'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var db = require('../../Kafka/app/db');
var config = require('./settings');

var cookieExtractor = function (req) {
    var token = null
    if (req && req.cookies) {
        token = req.cookies['auth_token']
    }
    return token
}

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = {
        jwtFromRequest: cookieExtractor,
        secretOrKey: config.secret
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {
        db.findUser({email_id: jwt_payload.email_id}, function (res) {
            var user = res;
            delete user.password;
            callback(null, user);
        }, function (err) {
            return callback(err, false);
        });
    }));
};


