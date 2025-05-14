const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created !");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewsId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewsId}});
    await Review.findByIdAndDelete(reviewsId);
    req.flash("success","Review Deleted !");
    res.redirect(`/listings/${id}`);
}