const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema({
    // user_id: ObjectId,
    cname:{
        type: String,
        required: true,
    },
    cimage:{
        type: String,
        required: true,
    },
    cstatus:{
        type: String,
        required: true,
    },
    date : {
        type: Date,
        default: Date.now(), 
    }
});

//Export the model
module.exports = mongoose.model('Category', categorySchema);