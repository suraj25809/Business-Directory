const mongoose = require("mongoose");

// category model
const Contact = require('../models/contactModel');

//get contact list
exports.getContact = (req, res) => {

    Contact.find().exec((err, contact) => {
        if(err)
        {
            res.render('backend/query/contact_list', { message : err.message });
        }
        else
        {
            res.render('backend/query/contact_list', { contact : contact });
        }
    });

}