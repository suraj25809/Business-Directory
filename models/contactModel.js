const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var contactSchema = new mongoose.Schema({
    cname:{
        type: String,
        required: true,
    },
    cemail:{
        type: String,
        required: true,
    },
    cphone:{
        type: Number,
        required: true,
    },
    csubject:{
        type: String,
        required: true,
    },
    cmessage:{
        type: String,
        required: true,
    },
    date : {
        type: Date,
        default: Date.now(), 
    }
});

//Export the model
module.exports = mongoose.model('Contact', contactSchema);