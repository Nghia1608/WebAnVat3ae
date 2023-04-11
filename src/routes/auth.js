const express = require('express');
const Users = require('../app/models/Users');

const router = express.Router();
const AuthController = require('../app/controllers/AuthController')
const SiteController = require('../app/controllers/SiteController')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../.././key.js');

const {
    verifyToken,
  } = require("../app/controllers/Middleware");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

  passport.deserializeUser((id, done) => {
  Users.findById(id)
    .then(user => {
      done(null, user);
    })
});
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: 'http://localhost:3000/auth/confirmLoginGoogle'
    }
    ,
    async (accessToken, refreshToken, profile, done) => {
      console.log("Auth.js");
      if (profile.id) {
          console.log("o day ne 22222222");
        await Users.findOne({username: profile.id})
          .then((existingUser,res,req) => {
             if (existingUser) {
              done(null, existingUser);
              console.log("User old");
              console.log(profile);
              return done(existingUser);
            } else {
               new Users({
                username: profile.id,
                password :'',
                email: profile.emails[0].value,
                hoTen: profile.name.familyName + ' ' + profile.name.givenName,
                sdt : '',
                diaChi :'',
                quyen :'Khach',
                trangThai:'Đang hoạt động' 
              })
                .save()
                .then(user => {
                  done(null, user)
                  console.log("User new");
                  console.log(profile);
                  return done(user);
                }
                  )
                ;
            }
          })
      }
  }
  )
);

  
//REGISTER
router.get('/register',AuthController.register);
router.post('/registerUser', AuthController.registerUser);

//REFRESH TOKEN
router.post('/refresh', AuthController.requestRefreshToken);
//LOG IN
router.get('/login',AuthController.login);
//LOG IN GOOGLE ACCOUNT
router.get(
  '/login1',
  passport.authenticate('google', {
    accessType: 'offline',
    callbackURL: 'http://localhost:3000/auth/confirmLoginGoogle',
    includeGrantedScopes: true,
    scope: ['profile', 'email'],
    prompt: 'select_account', // <=== Add your prompt setting here
}),
  AuthController.login1
);
router.get('/confirmLoginGoogle',
        passport.authenticate("google"
        ,{ 
          successRedirect: '/', 
          failureRedirect: "/auth/login" 
        }
        ),//lay token google
         AuthController.confirmLoginGoogle
        );


router.post('/confirmLogin',AuthController.confirmLogin);
//LOG OUT
router.post('/logout', verifyToken, AuthController.logOut);


module.exports = router;