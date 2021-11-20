const mongoose = require("mongoose");
const fs = require('fs');

// category model
const Category = require('../models/categoryModel');

//business model
const Business = require('../models/businessModel');

// get business list
exports.getBusinessList = (req, res) => {

    Business.find().exec((err, business) => {
        if(err)
        {
            res.render('backend/business/business_list', { error_msg : err.message });
        }
        else
        {
            res.render('backend/business/business_list', { data : business });
        }
    });

}

// add business page render
exports.addBusinessPage = (req, res) => {

    Category.find((err, data) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render('backend/business/business_add', { data : data });
        }
    })
    
}

// add business listing
exports.addBusiness = (req, res) => {

    const {category, uname, bname, tagline, details, phone, aphone, email, aemail, address, pincode, city, state, status, latitude, longitude } = req.body;
    
    const business = new Business({
        cname : category,
        uname : uname, 
        bname : bname, 
        btitle : tagline,
        bdetails : details, 
        phone : phone,
        aphone : aphone,
        email : email, 
        aemail : aemail,
        address : address,
        city : city, 
        pincode : pincode,
        state : state,
        bimage : req.file.filename, 
        status : status,
        latitude : latitude,
        longitude : longitude,
    });

    business.save( (err) => {
        
        if(err)
        {
           // res.render('frontend/listing', { error_msg : err.message });
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/admin/business/add');
        }
        else
        {
           // res.render('frontend/listing', { success : "Business Listing Added Successfully" });
            req.session.message = {
                type : 'success',
                message : 'Business Listing Added Successfully!!',
            };
            res.redirect('/admin/business/add');
        }

    });
    
}

// edit business page
exports.editBusinessPage = (req, res) => {
    let id = req.params.id;
    Business.findById(id, (err, business) => {
        if(err)
        {
            res.redirect('/admin/business');
        }
        else
        {
            if(business == null)
            {
                res.redirect('/admin/business');
            }
            else
            {
                Category.find((err, data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.render('backend/business/business_edit',{ business : business, data : data });
                    }
                });
            }
        }
    })
}

// update business
exports.updateBusiness = (req, res) => {

    let id = req.params.id;
    let new_image = '';

    if(req.file)
    {
        new_image = req.file.filename;
        try
        {
            fs.unlinkSync("./uploads/" + req.body.old_image);
        }catch(err) {
            console.log(err);
        }
    }
    else
    {
        new_image = req.body.old_image;
    }

    Business.findByIdAndUpdate(id, {

        cname : req.body.category,
        uname : req.body.uname, 
        bname : req.body.bname, 
        btitle : req.body.tagline,
        bdetails : req.body.details, 
        phone : req.body.phone,
        aphone : req.body.aphone,
        email : req.body.email, 
        aemail : req.body.aemail,
        address : req.body.address,
        city : req.body.city, 
        pincode : req.body.pincode,
        state : req.body.state,
        bimage : new_image, 
        status : req.body.status,
        latitude : req.body.latitude,
        longitude : req.body.longitude,

    }, (err,result) => {
        if(err)
        {
           // res.render('backend/business/business_edit', { error_msg : err.message });
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/admin/business');
        }
        else
        {
            req.session.message = {
                type : 'success',
                message : 'Business Listing Updated Successfully',
            };
            res.redirect('/admin/business');
            // console.log(result);
        }
    });

}

// view business

exports.viewBusiness = (req, res) => {
    let id = req.params.id;
    Business.findById(id, (err, data) =>{
        if(err)
        {
            res.redirect('/admin/business');
        }
        else
        {
            if(data == null)
            {
                res.redirect('/admin/business');
            }
            else
            {
               // res.render('backend/business/business_view',{ data : data });
               res.send(data);
            }
        }
    });
}

// delete business

exports.deleteBusiness = (req, res) =>{
    let id = req.params.id;
    Business.findByIdAndRemove(id, (err, result) =>{
        if(result.bimage != '')
        {
            try{
                fs.unlinkSync('./uploads/' + result.bimage);
            }catch(err)
            {
                console.log(err);
            }
        }
        
        if(err)
        {
            //res.render('backend/business/category_list', {  error_msg : err.message });
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/admin/business');
        }
        else
        {
            req.session.message = {
                type : 'success',
                message : 'Business Listing Deleted Successfully!',
            };
            res.redirect('/admin/business');
        }
    });
}