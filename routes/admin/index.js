const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// auth middleware
const auth = require('../../middleware/auth');

// user model
const User = require('../../models/adminModel');

// business model
const Business = require('../../models/businessModel');

// category model
const Category = require('../../models/categoryModel');

// vendor model
const Vendor = require('../../models/userModel');

// contact model

const Contact = require('../../models/contactModel');

router.get('/', (req, res) => {
   // res.send("login page");
    res.render('backend/index');
});

router.post('/',[
    check('username','User Name is Required').exists().notEmpty(),
    check('password','Password is Required').exists().notEmpty(),
], async (req, res) => {
    const {username,password} = req.body;
    const errors = validationResult(req);
    try {
        
        if (!errors.isEmpty())
        {
            res.render('backend/index', { errors: errors.array() });
        }
        else
        {
            let user = await User.findOne({ email : username });
      
            if(!user)
            {
                res.render('backend/index', { error_msg : "Invalid User Id & Password!!" });
            }
      
            let isMatch = await bcrypt.compareSync(password, user.password);
      
            if(!isMatch)
            {
                res.render('backend/index', { error_msg : "Invalid User Id & Password!!" });
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
                    res.cookie('jwt', token, { httpOnly : true, maxAge : 1000*24*60*60*7 });
                    //res.json({ token });
                     res.redirect('/admin/dashboard');
                });

            }
      
        }

    } catch (err) {
        console.log(err.message);
        res.status(400).send('Server Error');
    }
    
});

router.get('/register', (req, res) => {
    res.render('backend/register', { title: 'Registration Page' });
});

router.post('/register',
[
    check('username','Enter Full Name').exists().notEmpty(),
    check('email','Enter Valid Email').isEmail().normalizeEmail(),
    check('phone', 'Enter Valid Phone Number').isLength({ min : 10, max : 10 }).isInt(),
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 Digit'),
    check('cpassword').isLength({ min: 5 }).withMessage('Confirm Password must be at least 5 Digit'),
], async (req, res) => {

     const { username,email,phone,password,cpassword } = req.body;

    const errors = validationResult(req);
    try
    {
        
        if (!errors.isEmpty())
        {
            //return res.status(400).json({ error: errors.array() });
            res.render('backend/register', { errors: errors.array() });
        }
        else
        {
      
            const salt = await bcrypt.genSalt(10);
            const newpassword = await bcrypt.hashSync(password, salt);

            if(password == cpassword)
            {
                let user_exist = await User.findOne({ email });
                if(user_exist)
                {
                    res.render('backend/register', { error_msg : "User Already Exist!!" });
                }
                const user = new User();
                // user.user_id = mongoose.Types.ObjectId();
                user.name = username;
                user.email = email;
                user.phone = phone;
                user.password = newpassword;
                      
                await user.save();
                res.render('backend/register', { success : "Register Successfully" });
      
            }
            else
            {
                res.render('backend/register', { error_msg : "Password are Not match" });
            }
              
      
        }

    } catch (err) {
        console.log(err.message);
    }
    

});

router.get('/dashboard', auth, (req, res) => {

    Business.find().count((err,bdata)=>{
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            Category.find().count((err,cdata)=>{
                if(err)
                {
                    console.log(err.message);
                }
                else
                {
                   // console.log(bdata + " " + cdata);
                    Vendor.find().count((err, vdata)=>{
                        if(err)
                        {
                            console.log(err.message);
                        }
                        else
                        {
                            //console.log(bdata + " " + cdata + " " + vdata);
                            Contact.find().count((err,qdata)=>{
                                if(err)
                                {
                                    console.log(err.message);
                                }
                                else
                                {
                                    //console.log(bdata + " " + cdata + " " + vdata + " " + qdata);
                                    res.render('backend/dashboard', { bdata : bdata, cdata : cdata, vdata : vdata, qdata : qdata });
                                }
                            });
                            
                        }
                    });
                }
            });
           // console.log(bdata);
        }
    });
    //console.log(businessCount);
    
});



router.get('/logout', (req, res) => {

    // Clearing the cookie
    res.clearCookie('jwt');
    console.log("Cookie cleared");
    res.redirect('/admin');

});


module.exports = router;