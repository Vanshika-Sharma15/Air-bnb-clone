const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");




//REVIEWS
//reviews post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//review delete route
router.delete("/:reviewsId",isLoggedIn,isReviewAuthor,reviewController.destroyReview);
module.exports=router;