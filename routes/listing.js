const express= require("express");

// create router object
const router= express.Router();

const {listingSchema,reviewSchema}= require("../schema.js") ;
const Listing= require("../models/listing.js");

// for handling errors
const wrapAsync= require("../utils/wrapAsync.js");

// requiring for isvalidation fuction 
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

// requring controller

const listingController= require("../controllers/listings.js");

// multer is a node .js middleware for handling multipart /form data , which is used for uploading files .
// npm init multer

const multer= require("multer");
const {storage}= require("../cloudConfig.js");
//const upload = multer({dest:'uploads/'});
const upload = multer({storage});

// ROUTING API

// Index Route

// refer index callback in  controller--> listings

//router.get("/", wrapAsync(listingController.index));

// use router.route for merging index route and create route

router.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


 // New route
 // isloggedIn is a middleware to authenticate the user

 router.get("/new", isLoggedIn, listingController.renderNewForm);

 // show route, update route and delete route have same common path so we can handle them by using router.route

 router.route("/:id")
 .get(wrapAsync(listingController.showListing))
 .put(isLoggedIn,isOwner , upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
 .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


// showroute

//router.get("/:id ",wrapAsync(listingController.showListing));

 // create & new route-----> this route is put above the show route bcz /listings/:id in show route and /listings/new route will create problems


 
// creating listing for the apartment , villa, flat 

// app.get("/testListing",async(req,res)=>{

//     let sampleListing= new Listing({

//         title:"My new Villa",
//         description: "by the beach",
//         price: 1200,
//         location:"Calangate,Goa",
//         country: "India",

//     });

//     // save the sample listing into the database

//     await sampleListing.save();

//     console.log("sample was saved");

//     res.send("successful testing");

// })



 // create route
 // create route and index route have same path so we can use router.route to merge them

// router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.createListing));


 // Edit route:

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// Update Route

//router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));


// Delete Route

//router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



 module.exports= router;
