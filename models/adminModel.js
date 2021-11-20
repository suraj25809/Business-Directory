const mongoose = require('mongoose'); 
// const  Schema  = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    // user_id: ObjectId,
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type: Number,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    date : {
        type: Date,
        default: Date.now(), 
    }
});
// {
//     timestamps : true,
// }

//Export the model
module.exports = mongoose.model('Admin', userSchema);