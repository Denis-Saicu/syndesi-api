const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../../config/passport');

exports.LogIn = (req, res, next) => {
   passport.authenticate('local', { session: false },
      (error, user) => {

         if (error) {
            return res.status(400).json({
               success:false,
               message: error,
            })
         }

         if (!user) {
            return res.status(400).json({
               success:false,
               message: 'All fields are required',
            })
         }

         const payload = {
            email: user.email,
            userName: user.userName,
            uid: user.uid,
            photo: user.photo,
         };

         req.login(payload, { session: false }, (error) => {
            if (error) {
               return res.status(500).json(
                  {
                     success:false,
                     message: "Something went wrong on our side! Please try again later",
                  });
            }

            next();
         });
      }
   )(req, res)
}


