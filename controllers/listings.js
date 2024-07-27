
const Listing= require("../models/listing")

//  for geocoding map
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// controller for index route

module.exports.index= async (req, res) => {

    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });

 };

 // callback func for  new route

 module.exports.renderNewForm= (req,res)=>{

    res.render("listings/new.ejs")

};

//callback function for show route 

module.exports.showListing= async(req,res)=>{

    let {id}= req.params;

    // for populating the author of review we need do chaining of populate of reviews

    const listing= await Listing.findById(id).populate({path: "reviews",populate:{path:"author"},}).populate("owner");

    if(!listing){

        req.flash("error", "Listing you requested for doesnot exist!");

        res.redirect("/listings");
    }

    res.render("listings/show.ejs",{listing});

 };

 // callback function for creating new listing

 module.exports.createListing= async(req,res,next)=>{

    // for extracting information 
    // 1 method 

    //let {title,description,price ,image ,location,country}= req.body;

    // 2 method : easy way is to convert the coming information into {key of object}
    
    // listing is object 
    
    // if(!req.body.listing){
         
    //     throw new ExpressError(404,"send valid data for listing");
    // }

    // listingSchema.validate(req.body);

   // let listing= req.body.listing;

// -----------------------------------------------------------------------------------------------------------------//

 // now we upload images to the cloud and cloudianary will save the images and generate the url and we want to access the url 


 // for geocoding map 

  let response= await  geocodingClient.forwardGeocode({

    query: req.body.listing.location,

    limit:1,

  })
  .send()  
  
  //console.log(response.body.features[0].geometry);

  //res.send("done!!");

   let url= req.file.path;
   let filename= req.file.filename;

   const newListing= new Listing(req.body.listing);// passing listing into new Listing (listing ) creates the instance of the listing object
    
   newListing.owner= req.user._id;

   newListing.image= {url,filename};

   newListing.geometry= response.body.features[0].geometry;

   let savedListing= await newListing.save();

   //console.log(savedListing);

    // flashing message

    req.flash("success", "New Listing Created !");

    res.redirect("/listings");

 };

 // callback function for render edit form

 module.exports.renderEditForm= async(req,res)=>{

    let {id}=  req.params;

    const listing= await Listing.findById(id);

    // error message if listing is not available and we want to edit that listing

    if(!listing){

        req.flash("error", "Listing you requested for doesnot exist!");

        res.redirect("/listings");
    };

    let originalImageUrl= listing.image.url;
   // console.log(originalImageUrl);
    originalImageUrl= originalImageUrl.replace("/upload","/upload/h_250,w_250");

   // console.log(originalImageUrl);

    res.render("listings/edit.ejs",{listing,originalImageUrl});

};

// callback for update listing 

module.exports.updateListing = async(req,res)=>{


    let {id}= req.params;

    // updating by  passing  req.body.listing(object) and (...) used for converting into individual elem  to make the new uddation

   let listing=  await Listing.findByIdAndUpdate(id, {...req.body.listing });
   
  if( typeof req.file !== "undefined"){

    let url= req.file.path;
    let filename= req.file.filename;

    listing.image= {url,filename};
    await listing.save();
  } 
   

   

    //res.redirect("/listings");

    req.flash("success", " Listing Updated !");

    res.redirect(`/listings/${id}`);

};

// callback for delete route 

module.exports.destroyListing= async(req,res)=>{

    let {id}= req.params;

    await Listing.findByIdAndDelete(id);

    // flashing success message
    req.flash("success", "Listing Deleted !");

    res.redirect("/listings");

};



