const mongoose = require('mongoose'); 

// Declare the Schema 
var aboutSchema = new mongoose.Schema({
    atitle:{
        type: String,
        required: true,
    },
    aimage:{
        type: String,
        required: true,
    },
    adescription:{
        type: String,
        required: true,
    },
    date : {
        type: Date,
        default: Date.now(), 
    }
});

//Export the model
module.exports = mongoose.model('About', aboutSchema);