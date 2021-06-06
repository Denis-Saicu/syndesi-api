const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcrypt');
const UserModel = require('../authentication/models/user-model');

//local strategy for simple credential based log-in
passport.use(new LocalStrategy( {
    usernameField: "email",
    passwordField: "password",
},async(email,password,done) => {

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    if(!validateEmail(email)){
        done('Please enter a valid email adress!')
    }

    try {
        const userDocument = await UserModel.findOne( {email} ).exec();
        if(userDocument.activated === true){
        const passwordMatch = await bcrypt.compare(password,userDocument.password);
        if(passwordMatch) {
            return done(null,userDocument);
        }else {
            return done('Incorrect Password');
        }
      }else{
          return done("You need to activate your account")
      }
    } catch (error) {
        done('There is no account linked to this email.');
    }
}));
