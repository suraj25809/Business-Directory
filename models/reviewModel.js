const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var reviewSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    review:{
        type: String,
        required: true,
    },
    businessId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Business" 
    }
});
// {
//     timestamps : true,
// }

//Export the model
module.exports = mongoose.model('Review', reviewSchema);