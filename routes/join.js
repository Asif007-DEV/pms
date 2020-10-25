const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {check, validationResult, Result} = require('express-validator');
const addPasswordModel = require('../modules/addPassword');
const getPassword =addPasswordModel.find({});
if(typeof localStorage === "undefined" || localStorage === null){
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
const cheackLogin = (req,res,next)=>{
  var token = localStorage.getItem('usertoken');
    if(req.session.userName){
      jwt.verify(token,'logintoken');
    }else{
      res.render('index', { title: 'Password Management System', msg:'',err:'you need to login' });
    }
  next();
}


router.get('/',cheackLogin,(req, res, next) => {
    const userLogin = req.session.userName;
    addPasswordModel.aggregate([
        {
            $lookup:{
                from:'passwordcategories',
                localField:'password_category',
                foreignField:'password_category',
                as:'pass_cat_details'
            }
        },{
            $unwind:'$pass_cat_details'
        }
    ]).exec((err,results)=>{
        if(err) throw err;
        console.log(results);
        res.send(results);
    });
      
  });
  
  
  module.exports = router;