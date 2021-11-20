const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

//about controller
const AboutController = require('../../controllers/aboutController');

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

//get about data
router.get('/', AboutController.getAbout);


//update about
router.post('/update/:id', upload, AboutController.updateAbout);

//about add 
// router.post('/', upload, AboutController.addAbout);


module.exports = router;