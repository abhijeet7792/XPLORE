
// requiring the  listing
const Listing= require("./models/listing"); 

const Review= require("./models/review");

// for handling errors
//const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");

// requiring schema

const {listingSchema,reviewSchema}= require("./schema.js");


module.exports.isLoggedIn = (req,res, next) =>{
    
   // console.log(req.path, "...", req.originalUrl);
    
    if(!req.isAuthenticated()) {

        // if user is not logged in then we need to store the current url ....
        // redirect url save

        req.session.redirectUrl= req.originalUrl;
        

        req.flash("error","You must be logged in to create listing ! ");

        return  res.redirect("/login");
    }

    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{

     if(req.session.redirectUrl){

        res.locals.redirectUrl= req.session.redirectUrl;

     }

     next();
     
};  

// middleware for edit page / delete page  authorization 

module.exports.isOwner = async(req,res,next)=>{


    let {id}= req.params;
  
   let listing= await  Listing.findById(id);

   if( !listing.owner._id.equals(res.locals.currUser._id)){

       req.flash("error"," You are not the owner of this Listing !!")

      return  res.redirect(`/listings/${id}`);

   }

   next();
};

// listing validations

module.exports.validateListing= (req,res,next)=>{

    let {error}= listingSchema.validate(req.body);

   // console.log(result);

    if(error) {
        
        let errMsg= error.details.map((el)=>el.message).join(",");

        throw new ExpressError(400, errMsg );
    } 
    else {
        next();
    }
};

// validation for review

module.exports.validateReview= (req,res,next)=>{

    let {error}= reviewSchema.validate(req.body);

   // console.log(result);

    if(error) {
        
        let errMsg= error.details.map((el)=>el.message).join(",");

        throw new ExpressError(400, errMsg );
    } 
    else {
        next();
    }
};

// middleware for edit  review page / delete review page  authorization 

module.exports.isReviewAuthor = async(req,res,next)=>{


    let {id, reviewId}= req.params;
  
   let review = await  Review.findById(reviewId);

   if( !review.author._id.equals(res.locals.currUser._id)){

       req.flash("error","You are not the author of this review !!")

      return  res.redirect(`/listings/${id}`);

   }

   next();
};
