const mongoose= require("mongoose");

// we took variable Schema so that we not repeatily write the mongoose.schema
const Schema= mongoose.Schema;

const passportLocalMongoose= require("passport-local-mongoose");

const userSchema= new Schema({

    email:{

        type: String,
        required: true,
    },

});

// passport-local mongoose will add a username , hash and salted field to store the username , the hashed password and the salted value

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);
