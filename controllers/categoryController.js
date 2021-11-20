const mongoose = require("mongoose");
const fs = require('fs');

// category model
const Category = require('../models/categoryModel');

//fetch category
exports.fetchCategory = (req, res) => {

    // res.render('business/category_list', { title : "Category List" });

    Category.find().exec((err, category) => {
        if(err)
        {
            res.render('backend/business/category_list', { message : err.message });
        }
        else
        {
            res.render('backend/business/category_list', { categories : category });
        }
    })

}

// add category get method
exports.addCategoryPage = (req, res) => {
    res.render('backend/business/category_add');
}

// add category post method
exports.addCategory = (req, res) => {
    
    const category = new Category({
        cname : req.body.category,
        cimage : req.file.filename, 
        cstatus : req.body.status, 
    });

    category.save( (err) => {
        
        if(err)
        {
            res.render('backend/business/category_add', { error_msg : err.message });
        }
        else
        {
            res.render('backend/business/category_add', { success : "Category Added Successfully" });
        }

    });

}


// edit category page

exports.editCategoryPage = (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, category) => {
        if(err)
        {
            res.redirect('/admin/category');
        }
        else
        {
            if(category == null)
            {
                res.redirect('/admin/category');
            }
            else
            {
                res.render('backend/business/category_edit',{ category : category });
            }
        }
    })
}


// update category
exports.updateCategory = (req, res) => {

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

    Category.findByIdAndUpdate(id, {
        cname : req.body.category,
        cimage : new_image, 
        cstatus : req.body.status, 
    }, (err,result) => {
        if(err)
        {
            res.render('backend/business/category_edit', { error_msg : err.message });
        }
        else
        {
            req.session.message = {
                type : 'success',
                message : 'Category Update Successfully',
            };
            res.redirect('/admin/category');
            // console.log(result);
        }
    });

}


// delate category
exports.deleteCategory = (req, res) =>{
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, result) =>{
        if(result.cimage != '')
        {
            try{
                fs.unlinkSync('./uploads/' + result.cimage);
            }catch(err)
            {
                console.log(err);
            }
        }
        
        if(err)
        {
            res.render('backend/business/category_list', {  error_msg : err.message });
        }
        else
        {
            req.session.message = {
                type : 'success',
                message : 'Category Deleted Successfully!',
            };
            res.redirect('/admin/category');
        }
    });
}

