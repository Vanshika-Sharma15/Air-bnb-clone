const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js")
main().then((res)=>{
    console.log("connection through index,js formed successfully");
})
.catch((res)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    
}
const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((ob)=>({...ob,owner:'67dcb8bcd016604138404472'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

}
initDB();