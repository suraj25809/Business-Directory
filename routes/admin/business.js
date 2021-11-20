const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

// business controller
const businessController = require('../../controllers/businessController');

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


//get business list
router.get('/', businessController.getBusinessList);

// add business page
router.get('/add', businessController.addBusinessPage);

// add business post
router.post('/add', upload, businessController.addBusiness);

//edit page render
router.get('/edit/:id', businessController.editBusinessPage);

//update business
router.post('/edit/:id', upload, businessController.updateBusiness);

//view business
router.get('/view/:id', businessController.viewBusiness);

//delete business
router.get('/delete/:id', businessController.deleteBusiness);

module.exports = router;