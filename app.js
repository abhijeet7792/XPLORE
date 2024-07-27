
if(process.env.NODE_ENV!="production"){

    require('dotenv').config();
    //console.log(process.env);

    //  then we need to install the 
    // cloudinary
    // 
}

const express= require("express");
const app= express();
const mongoose= require("mongoose");
const methodOverride= require("method-override");
app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:true}));

// requiring ejs-mate --> ejs mate is used for fixing layout to every pages  
const ejsMate= require("ejs-mate");
app.engine("ejs",ejsMate);

// for ejs
const path= require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// for serving static file(css/js) 
app.use(express.static(path.join(__dirname,"/public")));

// require export file
const Listing= require("./models/listing.js");

// for handling errors
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");

// for client side validation or schema validation

const {listingSchema,reviewSchema}= require("./schema.js") ;


// port no
const port= 8080;

// requring listing routes;

const listingRouter= require("./routes/listing.js");
// requiring reviews routes;

const reviewRouter= require("./routes/review.js");

// requiring user signup and login router

const userRouter= require("./routes/user.js");


// requiring session for cookies and requiring mongo store for
// large data storing 

const session= require("express-session");
const MongoStore= require("connect-mongo");


// requiring connect-flash for flashing the message

const flash= require("connect-flash");

// for passport we need to require passport

const passport= require("passport");

const LocalStrategy= require("passport-local"); 
const User= require("./models/user.js");




// connecting mongoose with database

//const mongo_url= "mongodb://127.0.0.1:27017/wanderlust";  // wanderlust --> name of the database 

// creating connection with cloud

const dbUrl= process.env.ATLASDB_URL;

main().then(()=>{ console.log("successfully connected to DB");})
.catch((err)=> {
    console.log("error");
}    
);

// main function to connect database to js

async function main() {

    await mongoose.connect(dbUrl);
};


// using mongo store 

const store = MongoStore.create({

    mongoUrl: dbUrl,

    // for secret password
    crypto: {

        secret:process.env.SECRET,
    },

    touchAfter: 24*60*60,
});

store.on("error",()=>{

    console.log("Error in MONGO SESSION STORE",err);
})

// for implementing session

const sessionOptions=  {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,

    cookie:{

        expires: Date.now() + 7* 24 * 60 * 60 * 1000,
        maxAge: 7* 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// home route

// app.get("/",(req,res)=>{

//     res.send("server is working");
// });


// using session

app.use(session(sessionOptions));

// using connect-flash this will come before the app.use(/listings)

app.use(flash());

// passport validation

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// middleware for flashing message
// use this success msg to index.js

app.use((req,res,next)=>{

    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");

    // res.local.currentuser for knowing that if the current user is logged in or not
    res.locals.currUser= req.user;  
     
    next();
});





// const validateReview= (req,res,next)=>{

//     let {error}= reviewSchema.validate(req.body);

//    // console.log(result);

//     if(error) {
        
//         let errMsg= error.details.map((el)=>el.message).join(",");

//         throw new ExpressError(400, errMsg );
//     } 
//     else {
//         next();
//     }
// };


// for creating demo user

//  app.get("/demouser",async(req,res)=>{

//     let fakeUser= new User({

//         email: "student@gmail.com",
//         username: "student"
//     });

//     let registeredUser= await User.register(fakeUser,"helloworld");

//     res.send(registeredUser);
//  })

// require listing .js and using the route

app.use("/listings",listingRouter)

// requiring review.js and using the route

app.use("/listings/:id/reviews",reviewRouter);

// user router

app.use("/", userRouter);


// ROUTING API

// Index Route

// app.get("/listings", wrapAsync(async (req, res) => {

//     const allListings = await Listing.find({});

//     res.render("listings/index.ejs", { allListings });

//  }));

 
//  // create & new route-----> this route is put above the show route bcz /listings/:id in show route and /listings/new route will create problems


//  // New route
//  app.get("/listings/new",(req,res)=>{
 
//      res.render("listings/new.ejs");
    
//  })

//  // create route

//  app.post("/listings",validateListing, wrapAsync(async(req,res,next)=>{

//     // for extracting information 
//     // 1 method 

//     //let {title,description,price ,image ,location,country}= req.body;

//     // 2 method : easy way is to convert the coming information into {key of object}
    
//     // listing is object 
    
//     // if(!req.body.listing){
         
//     //     throw new ExpressError(404,"send valid data for listing");
//     // }

//     listingSchema.validate(req.body);

//     let listing= req.body.listing;

//     const newListing= new Listing(listing);// passing listing into new Listing (listing ) creates the instance of the listing object
    
//     await newListing.save();

//     res.redirect("/listings");

//  }));

//  // Edit route:

// app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{

//     let {id}=  req.params;

//     const listing= await Listing.findById(id);

//     res.render("listings/edit.ejs",{listing});


// }));

// Update Route

// app.put("/listings/:id",validateListing, wrapAsync(async(req,res)=>{


//     let {id}= req.params;

//     // updating by  passing  req.body.listing(object) and (...) used for converting into individual elem  to make the new uddation

//     await Listing.findByIdAndUpdate(id, {...req.body.listing });

//     //res.redirect("/listings");

//     res.redirect(`/listings/${id}`);

// }));


// // Delete Route

// app.delete("/listings/:id",wrapAsync(async(req,res)=>{

//     let {id}= req.params;

//     await Listing.findByIdAndDelete(id);

//     res.redirect("/listings");

// }));


//  // show route

//  app.get("/listings/:id",wrapAsync(async(req,res)=>{

//     let {id}= req.params;

//     const listing= await Listing.findById(id).populate("reviews");

//     res.render("listings/show.ejs",{listing});
//  })); 

 // for Review route

// app.post("/listings/:id/reviews", validateReview,wrapAsync (async(req,res)=>{

//      let listing= await Listing.findById(req.params.id);

//      let newReview= new Review(req.body.review); 

//      listing.reviews.push(newReview);

//      await newReview.save();

//      await listing.save();

//     // res.send("review show");

//      res.redirect(`/listings/${listing._id}`);
      
// }));

// // review delete route

// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
 
//    let { id,reviewId}= req.params;

//    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
//    await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// }) );*


// for default route
 app.all("*",(req,res,next)=>{
  
    next(new ExpressError(404,"Page Not Found"));

 });


 // error handling middleware

 app.use((err,req,res,next)=>{
   
    let {statuscode=500,message="something went wrong!"}= err;

    //res.status(statuscode).send(message);

    res.status(statuscode).render("error.ejs",{message});
 });




app.listen( port, ()=>{

    console.log("app is listening on port : 8080 ")
})