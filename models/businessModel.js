const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var businessSchema = new mongoose.Schema({
    cname:{
        type: String,
        required: true,
    },
    uname:{
        type: String,
        required: true,
    },
    bname:{
        type: String,
        required: true,
    },
    btitle:{
        type: String,
        required: true,
    },
    bdetails:{
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true,
    },
    aphone:{
        type: Number,
    },
    email:{
        type: String,
        required: true,
    },
    aemail:{
        type: String,
    },
    address:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    pincode:{
        type: Number,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    bimage:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    latitude:{
        type: String,
        required: true,
    },
    longitude:{
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(), 
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User" 
    },
    reviews:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
});

//Export the model
module.exports = mongoose.model('Business', businessSchema);