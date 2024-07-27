
const mongoose= require("mongoose");

// we took variable Schema so that we not repeatily write the mongoose.schema
const Schema= mongoose.Schema;

// schema for review and rating

const reviewSchema = new Schema({

    comment: String,

    rating: {

        type: Number,
        min: 1,
        max: 5 
    },

    createdAt:{

        type: Date,
        default: Date.now()
    },
    
    author:{

        type:Schema.Types.ObjectId,
        ref:"User",
    }
});


module.exports= mongoose.model("Review",reviewSchema);


