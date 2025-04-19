const express =require("express");
const router = express.Router({mergeParams:true});
const Listing =require("../models/listing.js");
const warpAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const{validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const Review =require("../models/review.js");
const reviewController = require("../controllers/reviews.js");

// Post Review Route
router.post("/",isLoggedIn, validateReview, warpAsync(reviewController.createReview));

// Delet Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,warpAsync(reviewController.destroyReview));

module.exports =router;