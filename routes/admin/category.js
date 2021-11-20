const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

// category controller
const categoryController = require('../../controllers/categoryController');

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

// fetch category
router.get('/', categoryController.fetchCategory);

// add category page
router.get('/add', categoryController.addCategoryPage);


// add category 
router.post('/add', upload, categoryController.addCategory);


// edit category
router.get('/edit/:id', categoryController.editCategoryPage);

//update category 
router.post('/update/:id', upload, categoryController.updateCategory);


//delete category
router.get('/delete/:id', categoryController.deleteCategory);


module.exports = router;