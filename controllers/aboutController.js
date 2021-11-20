const mongoose = require("mongoose");

// category model
const About = require('../models/aboutModel');

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

exports.getAbout = (req, res) => {

    About.findOne().exec((err, data) => {
        if(err)
        {
            res.render('backend/about', { error_msg : err.message });
        }
        else
        {
            res.render('backend/about', { data : data });
           //console.log(data);
        }
    });

 //   res.render('backend/about');

}


exports.updateAbout = (req, res) => {

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

    About.findByIdAndUpdate(id, {
        atitle : req.body.title,
        aimage : new_image, 
        adescription : req.body.description, 
    }, (err) => {
        if(err)
        {
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/admin/about');
        }
        else
        {
            req.session.message = {
                type : 'success',
                message : 'About Updated Successfully!!!',
            };
            res.redirect('/admin/about');  
        }
    });


}


exports.addAbout = (req, res) => {

    const about = new About({
        atitle : req.body.title,
        aimage : req.file.filename, 
        adescription : req.body.description, 
    });

    about.save( (err) => {
        
        if(err)
        {
            //res.render('backend/about', { error_msg : err.message });
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/admin/about');
        }
        else
        {
            //res.render('backend/about', { success : "About Updated Successfully!!!" });
            req.session.message = {
                type : 'success',
                message : 'About Updated Successfully!!!',
            };
            res.redirect('/admin/about');
        }

    });

}