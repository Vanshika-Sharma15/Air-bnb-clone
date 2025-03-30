const Listing=require("../models/listing.js");
const GeoJSON = require('geojson');


module.exports.index=async (req,res)=>{
    let allListing=await Listing.find();
     res.render("listings/index.ejs",{allListing});
 
 };
module.exports.renderNewForm=(req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
};
module.exports.showListing=async(req,res)=>{
      let {id}=req.params;
      const listing=await Listing.findById(id)
      .populate({path:"reviews",
         populate:{
             path:"author",
         },
      }).populate("owner");
      if(!listing){
         req.flash("error","Listing you requested for does not exist");
         res.redirect("/listings");
 
      }
      console.log(listing);
      res.render("listings/show.ejs",{listing});
      
};
  module.exports.createListing=async (req,res,next)=>{
    // let response=await geoCodingClient
    // .forwardGeocode({
    //     query:req.body.listing.location,
    //     limit: 1,
    //   })
    //     .send();
    // console.log(response.body.feature[0].geometry);
    // res.send("done");

 const url2 = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`;
// Make the API request to Nominatim
const response = await fetch(url2);
const data = await response.json();
 // Check if we received any results
if (data.length > 0) {
    const coordinates = {
        latitude: parseFloat(data[0].lat), // Convert to float
        longitude: parseFloat(data[0].lon)  // Convert to float
            };
        console.log("Coordinates:", coordinates);
        const geojson = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {
                        name: req.body.listing.location // Include the location name
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [coordinates.longitude, coordinates.latitude] // [longitude, latitude]
                    }
                }]
            }

    
        // return res.json(geojson);
                 
    
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,filename);
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=geojson.features[0].geometry; 
    let savedlisting=await newListing.save();
    console.log(savedlisting);
    req.flash("success","New Listing created !");
    res.redirect("/listings");
        }
};
module.exports.renderEditForm=async (req,res)=>{
         let {id}=req.params;
         let listing=await Listing.findById(id);
         if(!listing){
            req.flash("error","Listing you requested for does not exist");
            res.redirect("/listings");
        }
        let originalImageUrl=listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
         res.render("listings/edit.ejs",{listing,originalImageUrl});
};
module.exports.updateListing=async (req,res)=>{
          let {id}=req.params;
          let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
          if(typeof req.file !="undefined"){
          let url=req.file.path;
          let filename=req.file.filename;
          listing.image={url,filename};
          }
          if (req.body.listing.location !== listing.location) {
            const url2 = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`;
            const response = await fetch(url2);
            const data = await response.json();
            
            if (data.length > 0) {
                const coordinates = {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                };
                console.log("Coordinates:", coordinates);
                const geojson = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {
                                name: req.body.listing.location // Include the location name
                            },
                            geometry: {
                                type: "Point",
                                coordinates: [coordinates.longitude, coordinates.latitude] // [longitude, latitude]
                            }
                        }]
                    }
        
                listing.geometry=geojson.features[0].geometry;
                
            }
        }
        await listing.save();
          req.flash("success"," Listing Updated !");
          res.redirect(`/listings/${id}`);
          
};


module.exports.destroyListing=async (req,res)=>{
     let {id}=req.params;
     let deletedListing=await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success","Listing Deleted !");
     res.redirect("/listings");
};