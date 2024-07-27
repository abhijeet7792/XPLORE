
const User= require("../models/user");

// callback function for render signup form

module.exports.renderSignupForm= (req,res)=>{

    res.render("users/signup.ejs")
};

// callback for signUp 

module.exports.signup= async(req,res)=>{

    try{
    
       let {username,email,password}= req.body;
   
       const newUser=  new User({email,username});
   
       const registeredUser=  await User.register(newUser,password);
       
       // if user signup then user automatically signin as well
   
       req.login(registeredUser,(err)=>{
   
           if(err) {
               
               return next(err);
           }
   
           req.flash("success", "Welcome to WanderLust ! ");
   
           res.redirect("/listings");
   
   
       })
   
     
    }
    catch(e){
       
       req.flash("error",e.message);
       res.redirect("/signup");
   
    }
   
   };

   // callback function for render login form

   module.exports.renderLoginForm= (req,res)=>{

    res.render("users/login.ejs");
};

   // callback for login

   module.exports.login = async(req,res) =>{

    req.flash("success","Welcome back to WanderLust !");

     // res.redirect("req.session.originalUrl");  this will not work bcz  the passport bydefault clear the session after users login
    // solution for that : we save that value in locals and locals are accessible to every where and anywhere and 
    // passport havenot access to delete locals
   
   let redirectUrl= res.locals.redirectUrl || "/listings";
  //  to handle error
  
    res.redirect(redirectUrl);

} ;

// callback for logout

module.exports.logout = (req,res ,next)=>{

    req.logOut((err)=>{

        if(err) {

           return  next(err);
        }

        req.flash("success", "You are Logged Out !!");
        
        res.redirect("/listings");
    });

};