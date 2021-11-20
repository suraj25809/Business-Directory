const mongoose = require("mongoose");

// user model
const Vendor = require('../models/userModel');

//get user list
exports.getUsers = (req, res) => {

    Vendor.find().exec((err, user) => {
        if(err)
        {
            res.render('backend/query/users_list', { message : err.message });
        }
        else
        {
            res.render('backend/query/users_list', { user : user });
        }
    });

}