const mongoose = require("mongoose");
const Review = require("./review.js");
const { required } = require("joi");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
       url:String,
       filename:String,
} ,
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },
     geometry: {
        type: {
            type: String,
            enum: ['Point'], // Changed to 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
        category:{
            type:String,
            enum:["Mountain","Camping","Farms","Trending","Castles","Amazing pools","rooms","arctic","Iconic cities"]
        }
    

});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews }});
    }
    
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;