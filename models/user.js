const mongoose  = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email :{
        type : String,
        required : true, 
    },
});

userSchema.plugin(passportLocalMongoose); // we use this as a plugin so that passLocalMongoose will automatically add salting hashing anf username field also some api functions
module.exports = mongoose.model("User" , userSchema);