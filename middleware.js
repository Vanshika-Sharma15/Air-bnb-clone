const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
         throw new ExpressError(404,errMsg);
    }
    else{
        next();

    }

};
module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }
    else{
        next();

    }

};
module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
}
next();
};
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
     if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Owner of this listing");
        return res.redirect(`/listings/${id}`);
     }
     next();
};
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewsId}=req.params;
    let review=await Review.findById(reviewsId);
     if(res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Author of this review");
        return res.redirect(`/listings/${id}`);
     }
     next();
};
