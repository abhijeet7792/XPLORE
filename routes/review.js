const express= require("express");  
// create router object
// use merge params to merge parent and child roots
const router= express.Router({mergeParams: true});

// for handling errors
const wrapAsync= require("../utils/wrapAsync.js");

const Listing= require("../models/listing.js");
// for review schema 
const Review= require("../models/review.js");

// requiring validate review

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

// requiring review controller

const reviewController= require("../controllers/reviews.js");

 // for Review route

 router.post("/",isLoggedIn,  validateReview, wrapAsync (reviewController.createReview));

// review delete route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync ( reviewController.destroyReview) );

module.exports= router;
