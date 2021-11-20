const mongoose = require('mongoose'); 

// Declare the Schema 
var feedbackSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true,
    },
    femail:{
        type: String,
        required: true,
    },
    feedback:{
        type: String,
        required: true,
    },
    frate:{
        type: Number,
        required: true,
    },
    date : {
        type: Date,
        default: Date.now(), 
    }
});

//Export the model
module.exports = mongoose.model('Feedback', feedbackSchema);