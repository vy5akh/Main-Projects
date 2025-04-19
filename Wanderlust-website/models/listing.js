const mongoose =require("mongoose");
const Review = require("./review.js");
const { string } = require("joi");
const Schema = mongoose.Schema;

// Schema created
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
       url:String,
       filename:String,
    },
   price:Number,
   location:String,
   country:String,  
   reviews: [
    {
        type : Schema.Types.ObjectId,
        ref: "Review"
    }
    
   ],
   owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
}
}); 



listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in:listing.reviews}});
    }
});


// Creat the collection with schema => listingSchema
const Listing = mongoose.model("Listing",listingSchema);
module.exports =Listing;