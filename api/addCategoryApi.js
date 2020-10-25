const express = require('express');
const router = express.Router();
const categoryModel = require('../modules/passwordCategories');

router.get('/',(req,res, next)=>{
    categoryModel.find({},{password_category:1},(err, data)=>{
        if(err) throw err;
        res.send(data);
    });
});

router.post('/addCategory',(req,res,next)=>{
    categoryModel({
        password_category: req.body.pass_cat
    }).save((err,doc)=>{
        if(err) throw err;
        res.send("Insert Category Successfully");
    });
});

router.put('/putCategory',(req,res,next)=>{
    categoryModel.findById(req.body._id,(err,data)=>{
        if(err) throw err;
        data.password_category= req.body.pass_cat ? req.body.pass_cat : data.password_category
        data.save((err,doc)=>{
            if(err) throw err;
            res.send("Update Password Category By Put Method"+doc);
        });
    });  
});

router.patch('/putchCategory',(req,res,next)=>{     
    categoryModel.findById(req.body._id,(err,data)=>{
        if(err) throw err;
        data.password_category= req.body.pass_cat ? req.body.pass_cat : data.password_category
        data.save((err,doc)=>{
            if(err) throw err;
            res.send("Update Password Category By Patch Method"+doc);
        });
    });
});
router.delete('/deleteCategory',(req,res,next)=>{     
    categoryModel.findByIdAndDelete(req.body._id,(err,data)=>{
        if(err) throw err;
        res.send("Delete Category Successfully... "+data.password_category);
    });
});

module.exports = router;