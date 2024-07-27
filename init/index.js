const mongoose= require("mongoose");
const initData=  require("./data.js");
const Listing= require("../models/listing.js");

 // connection with DB

 const mongo_url= "mongodb://127.0.0.1:27017/wanderlust";

 main().then(()=>{ console.log("successfully connected to DB");})
 
 .catch((err)=> {
     console.log("error");
 }
 
 );
 
 async function main() {
 
     await mongoose.connect(mongo_url);
 }
 
 
 // function to delete and update databases
 
 const initDB= async()=>{
 
     await Listing.deleteMany({});
    
     // for inserting the owner of the each listing so that we can authrized the user and give the access to edit/del/
     // map return new array 
     initData.data = initData.data.map((obj)=>({...obj, owner:'669ced9ccc5ccd42d5360d85'}));

     await Listing.insertMany(initData.data);

     console.log("data was intialized");
     
 }

 // calling the intiDb function

 initDB();