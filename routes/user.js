const express= require("express");  
// create router object
// use merge params to merge parent and child roots
const router= express.Router();

// for creating new user we need to require the user model

const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// requiring controller for user

const userController= require("../controllers/users.js");


// we can use router.route for combining these routes 

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync( userController.signup));

// login and login 

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true,}),userController.login);


/// signup route

// router.get("/signup",userController.renderSignupForm);

// router.post("/signup",wrapAsync( userController.signup));

// for login and login authentication

//router.get("/login",userController.renderLoginForm);



// for authenticating user 
// we need to call a middleware to authenticate the user

// for redirect the loggedu user to their current url we made a middleware and that we need to require and use


// login route

//router.post("/login", saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true,}),userController.login);


// logout route

router.get("/logout",userController.logout);

module.exports= router;
