const mongoose = require("mongoose");

// category model
const Feedback = require('../models/FeedbackModel');

exports.getFeedback = (req, res) => {

    Feedback.find().exec((err, data) => {
        if(err)
        {
            res.render('backend/query/feedback_list', { message : err.message });
        }
        else
        {
            res.render('backend/query/feedback_list', { feedback : data });
        }
    });

}