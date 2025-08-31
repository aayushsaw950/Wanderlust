const express = require('express');
const router = express.Router({mergeParams : true}); //to access listing id in reviews routes 
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require('../schema.js');
const Listing = require('../models/listing');
const Review = require("../models/review.js");
const wrapAsync = require('../utils/wrapAsync');
const {validateReview, isLoggedIn, isReviewAuthor, saveRedirectUrl} = require("../middleware.js")
const reviewController = require("../controller/review.js");
const review = require('../models/review.js');



//reviews
router.post("/" , isLoggedIn,
    validateReview, wrapAsync( reviewController.create));

//delete route
router.delete("/:review_Id" ,isLoggedIn, saveRedirectUrl, isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports= router