const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing =require("../models/listing.js");


const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
//Show connection states 
main().then(()=>{
    console.log("connected to DB");  
})
.catch((err)=>{
    console.log(err);
});


// Try to connect to DB  using the url MONGO_URL
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({}); 
    initData.data= initData.data.map((obj)=>({
        ...obj,owner:'6776941d3b2d6e90b07e71aa'
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();