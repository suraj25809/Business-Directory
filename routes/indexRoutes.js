const express = require('express');
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const router = express.Router();


//main controller 
const mainController = require('../controllers/mainController');

//users model
const Vendor = require('../models/userModel');

//business model
const Business = require('../models/businessModel');

//review model
const Review = require('../models/reviewModel');

//category model
const Category = require('../models/categoryModel');

//user auth 
const userAuth = require('../middleware/userAuth');


//image upload
var storage = multer.diskStorage({
    destination:function(req, file,cb){
        cb(null, './uploads/');
    },
    filename:function(req,file,cb)
    {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage:storage,
}).single("image");

// end file upload

//home page
router.get('/', mainController.getHomePage);

//about page
router.get('/about', mainController.getAboutPage);

// listing page
router.get('/listing', userAuth, mainController.getAddListingPage);

// listing post
router.post('/listing', upload, mainController.addListingPage);

//contact page
router.get('/contact', mainController.getContactPage);

// contact post
router.post('/contact', mainController.postContactPage);

//feedback page
router.get('/feedback', mainController.getFeedbackPage);

//feedback post
router.post('/feedback', mainController.postFeedbackPage);

// search box search
router.get('/search', mainController.searchData);

//category wise search
router.get('/find/:category', mainController.searchCategory);

// view single listing
router.get('/view/:id', mainController.viewListingPage);

router.post('/view/:id', async (req,res)=>{
    //console.log(req.body);
    let id = req.params.id;
    const { businessId, uname, rating, feedback} = req.body;
    //find a business
    const business = await Business.findOne({_id : businessId});

    //create a review 
    const review = new Review();
    review.name = uname;
    review.rating = rating;
    review.review = feedback;
    review.businessId = business._id;

    await review.save();

    //associate business with review
    business.reviews.push(review._id);
    await business.save((err)=>{
        
        if(err)
        {
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/view/'+id);
        }
        else
        {
            req.session.message = {
                type : 'success',
                message : 'Review Added Successfully!!',
            };
            res.redirect('/view/'+id);
        }

    });


});


router.get('/login', (req, res) => {
    res.render('frontend/login');
});

router.post("/login", [
    check('email','User Name is Required').exists().notEmpty(),
    check('password','Password is Required').exists().notEmpty(),
], async (req,res)=>{
    
    const {email,password} = req.body;
    const errors = validationResult(req);
    //console.log(errors);

    try {

        if (!errors.isEmpty())
        {
            res.render('frontend/login', { errors: errors.array() });
        }
        else
        {
            let user = await Vendor.findOne({ email : email });
            //console.log(user);
            if(!user)
            {
                res.render('frontend/login', { error_msg : "Invalid User Id & Password!!" });
            }

            let isMatch = await bcrypt.compareSync(password, user.password);
            if(!isMatch)
            {
                res.render('frontend/login', { error_msg : "Invalid User Id & Password!!" });
            }
            else
            {
                const payload = {
                    user:{
                        id : user.id
                    }
                };
                jwt.sign(payload, process.env.SECRET, {
                    expiresIn : 360000,
                }, (err, token) => {
                    if(err) throw err;
                    // res.cookie('jwt', token, { httpOnly : true, maxAge : 7 * 24 * 60 * 60, secure : true });
                    res.cookie('userjwt', token, { httpOnly : true, maxAge : 1000*24*60*60*7 });
                    //res.json({ token });
                     res.redirect('/');
                });
            }
        }
        
    } catch (err) {
        console.log(err.message);
        res.status(400).send('Server Error');
    }

});

router.get('/register', (req, res) => {
    res.render('frontend/register');
});

router.post("/register", [
    check('cname','Enter Full Name').exists().notEmpty(),
    check('email','Enter Valid Email').isEmail().normalizeEmail(),
    check('phone', 'Enter Valid Phone Number').isLength({ min : 10, max : 10 }).isInt(),
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 Digit')
], async (req,res) =>{

    const errors = validationResult(req);
    //console.log(errors);

    try {
        if (!errors.isEmpty())
        {
            res.render('frontend/register', { errors: errors.array() });
        }
        else
        {
            const { cname, email, phone, password } = req.body;
            const salt = await bcrypt.genSalt(10);
            const newpassword = await bcrypt.hashSync(password, salt);
            //console.log(req.body);
            let user_exist = await Vendor.findOne({ email });
            if(user_exist)
            {
                res.render('frontend/register', { error_msg : "User Already Exist!!" });
            }

            const vendor = new Vendor();
            vendor.name = cname;
            vendor.email = email;
            vendor.phone = phone;
            vendor.password = newpassword;

            await vendor.save();
            res.render('frontend/register', { success : "Register Successfully" });

        }
    } catch (err) {
        console.log(err.message);
        res.status(400).send('Server Error');
    }

});

router.get('/forget', (req, res) => {
    res.render('frontend/forget');
});

router.post("/forget", [
    check('email','Please Enter Valid Email').isEmail().normalizeEmail()
], async (req,res)=>{

    const email = req.body.email;
    const errors = validationResult(req);
    try {

        if (!errors.isEmpty())
        {
            res.render('frontend/forget', { errors: errors.array() });
        }
        else
        {
            let user_exist = await Vendor.findOne({ email });
            if(!user_exist)
            {
                res.render('frontend/forget', { error_msg : "User Not Exist Register Now!!" });
            }
            else
            {
               // res.send(user_exist.id);
                res.redirect("/update/"+user_exist.id);
            }
        }
        
    } catch (err) {
        console.log(err.message);
        res.status(400).send('Server Error');
    }

});

router.get("/update/:id", (req,res)=>{
    res.render('frontend/update-password', { userid: req.params.id });
})

router.post("/update/:id", [
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 Digit'),
    check('cpassword').isLength({ min: 5 }).withMessage('Password must be at least 5 Digit')
], async (req,res)=>{

    const errors = validationResult(req);
    const {password, cpassword} = req.body;
    let id = req.params.id;

    try {

        if (!errors.isEmpty())
        {
            res.render('frontend/update-password', { errors: errors.array(), userid: id });
        }
        else
        {
            if(password == cpassword)
            {
                const salt = await bcrypt.genSalt(10);
                const newpassword = await bcrypt.hashSync(password, salt);


                Vendor.findByIdAndUpdate(id, {
                    password : newpassword
                }, (err) => {
                    if(err)
                    {
                        res.render('frontend/update-password', { error_msg : err.message , userid: id });
                    }
                    else
                    {
                        req.session.message = {
                            type : 'success',
                            message : 'Password Updated Successfully!!',
                        };
                        res.redirect('/login');
                    }
                });

               // res.send("Password Updated");
            }
            else
            {
                res.render('frontend/update-password', { error_msg : "Both Password are Not Match!!", userid: id });
            }
            
        }
        
    } catch (err) {
        console.log(err.message);
        res.status(400).send('Server Error');
    }

});


router.get('/profile', userAuth, (req, res) => {

    let userId = req.user;
    let id = userId.id;

    Vendor.findById({_id : id}, (err, data) =>{
        if(err)
        {
            console.log(err.message);
        }
        else
        {

            Business.find({ userId : id }).exec((err, bdata)=>{
                if(err)
                {
                    console.log(err.message);
                }
                else
                {
                    res.render('frontend/profile', { data : data , bdata : bdata });
                   // console.log(businessData);
                }
            });
           // console.log(data);
            
           //console.log(businessData);
        }
    });

    //console.log(data);
    

});


router.post('/profile', userAuth, (req,res)=>{
    
    const { userId, cname, email, phone} = req.body;

    Vendor.findByIdAndUpdate(userId, {
        name : cname,
        email : email, 
        phone : phone, 
    }, (err) => {
        if(err)
        {
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/profile');
        }
        else
        {
            req.session.message = {
                type : 'success',
                message : 'Profile Updated Successfully',
            };
            res.redirect('/profile');
            
        }
    });


});


router.get('/business/delete/:id', (req,res)=>{

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
            res.redirect('/profile');
        }
        else
        {
            req.session.message = {
                type : 'success',
                message : 'Business Listing Deleted Successfully!',
            };
            res.redirect('/profile');
        }
    });

});


router.get('/business/edit/:id', userAuth, (req,res)=>{
   
    let id = req.params.id;
    Business.findById(id, (err, business) => {
        if(err)
        {
           // res.redirect('/admin/business');
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/profile');
        }
        else
        {
            if(business == null)
            {
                res.redirect('/profile');
            }
            else
            {
                Category.find((err, data) => {
                    if(err)
                    {
                        //console.log(err);
                        req.session.message = {
                            type : 'warning',
                            message : err.message,
                        };
                        res.redirect('/profile');
                    }
                    else
                    {
                        
                        let userId = req.user;
                        let uid = userId.id;

                        Vendor.findById({_id : uid}, (err, udata) =>{
                            if(err)
                            {
                                req.session.message = {
                                    type : 'warning',
                                    message : err.message,
                                };
                                res.redirect('/profile');
                            }
                            else
                            {
                                res.render('frontend/listing-update',{ business : business, data : data, userdata : udata });
                            }
                        });
                    
                    }
                });
            }
        }
    });


});


router.post('/business/edit/:id', upload, (req,res)=>{

    let id = req.params.id;
    let new_image = '';

    if(req.file)
    {
        new_image = req.file.filename;
        try
        {
            fs.unlinkSync('./uploads/' + req.body.old_image);
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
        btitle : req.body.btagline,
        bdetails : req.body.bdetails, 
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
        userId : req.body.userId,

    }, (err) => {
        if(err)
        {
            req.session.message = {
                type : 'warning',
                message : err.message,
            };
            res.redirect('/profile');
        }
        else
        {
            req.session.message = {
                type : 'success',
                message : 'Business Listing Updated Successfully',
            };
            res.redirect('/profile');
        }
    });

});

router.get('/logout', (req, res) => {

    // Clearing the cookie
    res.clearCookie('userjwt');
    console.log("Cookie cleared");
    res.redirect('/login');
    
});

module.exports = router;




// router.get('/error', (req, res) => {
//     res.render('frontend/error');
// });
