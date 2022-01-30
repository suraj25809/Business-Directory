const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// category model
const Category = require('../models/categoryModel');

// business model 
const Business = require('../models/businessModel');

// contact model
const Contact = require('../models/contactModel');

// feedback model
const Feedback = require('../models/FeedbackModel');

// about model
const About = require('../models/aboutModel');

// vendor model
const Vendor = require('../models/userModel');

// email nodemailer
let transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    service : 'gmail',
    auth: {
      user: 'youremailaddress', // generated ethereal user
      pass: 'emailpassword', // generated ethereal password
    },
});


// home page
exports.getHomePage = (req, res) => {

    Category.find({ cstatus : 'Active' }, (err, category) =>{
        if(err)
        {
            res.render('frontend/index', { error_msg : err.message });
        }
        else
        {
            Business.find((err, bdata) => {
                if(err)
                {
                    res.render('frontend/index', { error_msg : err.message });
                }
                else
                {
                    res.render('frontend/index', { category : category, bdata : bdata });
                }
            }).limit(6).sort({date : -1});
            
        }
    });
    
    
}

// about page
exports.getAboutPage = (req, res) => {

    About.findOne().exec((err, data) => {
        if(err)
        {
            res.render('frontend/about', { error_msg : err.message });
        }
        else
        {
            res.render('frontend/about', { data : data });
           //console.log(data);
        }
    });

    //res.render('frontend/about');
}

// get listing page
exports.getAddListingPage = (req, res) => {
    
    let userId = req.user;
    let id = userId.id;

    //res.render('frontend/listing');
    Category.find((err, data) => {
        if(err)
        {
            console.log(err);
        }
        else
        {

            Vendor.findById({_id : id}, (err, userdata) =>{
                if(err)
                {
                    console.log(err.message);
                }
                else
                {
                   // console.log(data);
                   res.render('frontend/listing', { data : data , userdata : userdata });
                }
            });


            
        }
    });

}

// add listing
exports.addListingPage = (req, res) => {
    
    //console.log(req.body);
    const { userId, category, bname, btagline, bdetails, uname, phone, aphone, email, aemail, address, city, pincode, state, latitude,longitude } = req.body;

    let status = 'Active';

    const business = new Business({
        cname : category,
        uname : uname, 
        bname : bname, 
        btitle : btagline,
        bdetails : bdetails, 
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
        userId : userId
    });

    business.save( (err) => {
        
        if(err)
        {
           // res.render('frontend/listing', { error_msg : err.message });
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/listing');
        }
        else
        {
           // res.render('frontend/listing', { success : "Business Listing Added Successfully" });
            req.session.message = {
                type : 'success',
                message : 'Business Listing Added Successfully!!',
            };
            res.redirect('/listing');
        }

    });

}

// contact page render
exports.getContactPage = (req, res) => {
    res.render('frontend/contact');
}

// post contact data
exports.postContactPage = (req, res) => {
    //res.render('frontend/contact');
    const { cname, email, phone, subject, message } = req.body;
    const contact = new Contact({
       cname : cname,
       cemail : email,
       cphone : phone,
       csubject : subject,
       cmessage : message,
    });

    const mailOptions = {
        from : email,
        to : 'akashjaiswal1226@gmail.com',
        subject : subject,
        text : message,
        html: `<p>Name : ${cname} <br/> Email : ${email} <br/> Phone : ${phone} <br/> Subject : ${subject} <br/> Message : ${ message} <br/></p>`,
    };

    contact.save((err) => {

        if(err)
        {
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/contact');
        }
        else
        {
            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    req.session.message = {
                        type : 'warning',
                        message : err.message,
                    };
                    res.redirect('/contact');
                }
                else
                {
                    req.session.message = {
                        type : 'success',
                        message : 'Message Send Successfully!!',
                    };
                    res.redirect('/contact');
                }
            });
            
        }

    });


}

// get feedback page
exports.getFeedbackPage = (req, res) => {
    res.render('frontend/feedback');
}

//post feedback data
exports.postFeedbackPage = (req, res) => {

    const { name, email, feedback, rating } = req.body;
    const data = new Feedback({
       fname : name,
       femail : email,
       feedback : feedback,
       frate : rating,
    });

    data.save((err) => {

        if(err)
        {
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/feedback');
        }
        else
        {
            req.session.message = {
                type : 'success',
                message : 'Feedback Submit Successfully!!',
            };
            res.redirect('/feedback');
        }

    });

}

// search data
exports.searchData = (req, res) => {

    const searchName = req.query.name;
    const searchLocation = req.query.location;

    Business.find({ bname :{ $regex : searchName, $options : '$i'}, city : { $regex : searchLocation, $options : '$i'} }, (err, bdata) =>{
        if(err)
        {
            res.render('frontend/list', { error_msg : err.message });
        }
        else
        {
            res.render('frontend/list', { bdata : bdata });
        }
    });

}

// category search
exports.searchCategory = (req, res) => {

    const searchCategory = req.params.category;

    Business.find({ cname :{ $regex : searchCategory} }, (err, bdata) =>{
        if(err)
        {
            res.render('frontend/list', { error_msg : err.message });
        }
        else
        {
            res.render('frontend/list', { bdata : bdata });
        }
    });

}

// view deatils listing page
exports.viewListingPage = (req, res) => {

    const viewId = req.params.id;
    Business.findById({ _id : viewId }, (err ,data) => {

        if(err)
        {
            res.render('frontend/single', { error_msg : err.message });
        }
        else
        {
            if(data == null)
            {
                res.redirect('/');
            }
            else
            {
                res.render('frontend/single', { data : data });
            }

            //console.log(data.reviews);

        }

    }).populate("reviews");

}


// router.get('/list', (req, res) => {

//     Business.find((err, bdata) => {
//         if(err)
//         {
//             res.render('frontend/list', { error_msg : err.message });
//         }
//         else
//         {
//             res.render('frontend/list', { bdata : bdata });
//         }
//     }).limit(3);

// });
