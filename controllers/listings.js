
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
module.exports.createListing = async (req,res)=>{

console.log("Create listing controller started");
console.log(req.body);

const url2 = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(req.body.listing.location)}`;

const response = await fetch(url2,{
    headers:{ "User-Agent":"airbnb-clone" }
});

const data = await response.json();

console.log("API response:",data);

if(data.length === 0){
    req.flash("error","Location not found");
    return res.redirect("/listings/new");
}

if(!req.file){
    req.flash("error","Image upload failed");
    return res.redirect("/listings/new");
}

const geometry = {
    type:"Point",
    coordinates:[
        parseFloat(data[0].lon),
        parseFloat(data[0].lat)
    ]
};

let url=req.file.path;
let filename=req.file.filename;

const newListing=new Listing(req.body.listing);

newListing.owner=req.user._id;
newListing.image={url,filename};
newListing.geometry=geometry;

await newListing.save();

req.flash("success","New Listing Created!");
res.redirect("/listings");
};
// module.exports.createListing = async (req, res) => {
// const url2 = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`;

// const response = await fetch(url2,{
//     headers:{
//         "User-Agent":"airbnb-clone-app"
//     }
// });

// const data = await response.json();
// console.log(data);

// if (data.length === 0) {
//     req.flash("error","Location not found");
//     return res.redirect("/listings/new");
// }

// const coordinates = {
//     latitude: parseFloat(data[0].lat),
//     longitude: parseFloat(data[0].lon)
// };

// const geojson = {
//     type: "Point",
//     coordinates: [coordinates.longitude, coordinates.latitude]
// };

// if(!req.file){
//     req.flash("error","Image upload failed");
//     return res.redirect("/listings/new");
// }

// let url = req.file.path;
// let filename = req.file.filename;

// const newListing = new Listing(req.body.listing);

// newListing.owner = req.user._id;
// newListing.image = { url, filename };
// newListing.geometry = geojson;

// await newListing.save();

// req.flash("success","New Listing created!");
// res.redirect("/listings");
// };
// module.exports.createListing = async (req,res)=>{

// const url2 = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(req.body.listing.location)}`;

// const response = await fetch(url2,{
//     headers:{
//         "User-Agent":"airbnb-clone-app"
//     }
// });

// const data = await response.json();

// if(data.length === 0){
//     req.flash("error","Location not found");
//     return res.redirect("/listings/new");
// }

// const geometry = {
//     type: "Point",
//     coordinates: [
//         parseFloat(data[0].lon),
//         parseFloat(data[0].lat)
//     ]
// };

// let url = req.file.path;
// let filename = req.file.filename;

// const newListing = new Listing(req.body.listing);

// newListing.owner = req.user._id;
// newListing.image = {url,filename};
// newListing.geometry = geometry;

// await newListing.save();

// req.flash("success","New Listing Created!");
// res.redirect("/listings");
// };
// module.exports.createListing=async (req,res)=>{
// const url2 = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`;
// // Make the API request to Nominatim
// const response = await fetch(url2);
// const data = await response.json();
//  // Check if we received any results
// if (data.length > 0) {
//     const coordinates = {
//         latitude: parseFloat(data[0].lat), // Convert to float
//         longitude: parseFloat(data[0].lon)  // Convert to float
//             };
//         console.log("Coordinates:", coordinates);
//         const geojson = {
//             type: "FeatureCollection",
//             features: [
//                 {
//                     type: "Feature",
//                     properties: {
//                         name: req.body.listing.location // Include the location name
//                     },
//                     geometry: {
//                         type: "Point",
//                         coordinates: [coordinates.longitude, coordinates.latitude] // [longitude, latitude]
//                     }
//                 }]
//             }

    
//         // return res.json(geojson);
                 
    
//     let url=req.file.path;
//     let filename=req.file.filename;
//     console.log(url,filename);
//     const newListing=new Listing(req.body.listing);
//     newListing.owner=req.user._id;
//     newListing.image={url,filename};
//     newListing.geometry=geojson.features[0].geometry; 
//     let savedlisting=await newListing.save();
//     console.log(savedlisting);
//     req.flash("success","New Listing created !");
//     res.redirect("/listings");
//         }
// };
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