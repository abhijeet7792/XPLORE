// we make a listing model in this file and then we export to the app.js and then use this model or schema 

const mongoose= require("mongoose");

// we took variable Schema so that we not repeatily write the mongoose.schema
const Schema= mongoose.Schema;

// require review for deleting all review when listing is deleted

const Review= require("./review.js");
const { required } = require("joi");

// creatiing schema
const listingSchema= new Schema({

    title: {
        type: String,
        required: true,
    },

    description: String,

    // image aa rhi h but image ka value "" empty h ,so for that we set the value , but if want to assign a value of image if image value
    // is not given so for that we use default value

    image: {
        
        url:String,
        filename:String,
      },

    price: Number,
    location: String,
    country: String,

    reviews: [

      {
        type: Schema.Types.ObjectId,
        ref:"Review",
      }
    ],

    owner:{
      
      type: Schema.Types.ObjectId,
      ref:"User",

    },

    // coordinates:{

    //   type:[Number],
    //   requires:true,
    // }

    // geoJson form 

    geometry:{
     
      type:{

        type: String,
        enum:["Point"],
        required:true,
      },

      coordinates:{

        type:[Number],

        required:true,
      }

    }
    
});

// post mongoose middleware

listingSchema.post("findOneAndDelete", async(listing)=>{
  
  if(listing){

     await Review.deleteMany({_id: {$in:listing.reviews}});
  }
    
});

// creating model

const Listing= mongoose.model("Listing",listingSchema);

// exporting the file to another

module.exports= Listing ;
