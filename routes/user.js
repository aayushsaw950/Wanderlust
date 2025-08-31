const express = require('express');
const router = express.Router({mergeParams : true}); //to access listing id in reviews routes 
const User = require("../models/user.js"); //done
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controller/user.js")

router.get("/signup" , userController.renderSignup);

router.post("/signup" , wrapAsync(userController.signUp))

router.get("/login" , userController.renderLogin);

router.post("/login" , saveRedirectUrl, 
    passport.authenticate("local",
         { failureRedirect: "/login"  ,
         failureFlash : true}) , userController.login )

router.get("/logout" , userController.logOut)

module.exports = router;