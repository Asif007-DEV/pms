const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const userModel = require('../modules/users');
const passCatModel = require('../modules/passwordCategories');
const getPassCat = passCatModel.find({});
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


/*GET to view Password Category List */
router.get('/',cheackLogin,(req, res, next) => {
    const userLogin = req.session.userName;
    getPassCat.exec((err, data)=>{
      if(err) throw err;
      res.render('passwordCategoryList', { title: 'Password Category',records:data, userLogin:userLogin});
    });
  });
  
  /*GET to Dalete Category*/
  router.get('/delete/:id',(req,res,next)=>{
    const delCategory = passCatModel.findByIdAndDelete(req.params.id);
    delCategory.exec((err,data)=>{
      if(err) throw err;
      res.redirect('/categoryList');
    });
  });
  
  /*GET renter to edit page Update Category*/
  router.get('/edit/:id',cheackLogin,(req,res,next)=>{
    const userLogin = req.session.userName;
    const getCategory = passCatModel.findById(req.params.id);
    getCategory.exec((err,data)=>{
      if(err) throw err;
      res.render('edit', { title: 'Update Password Category',records:data, userLogin:userLogin});
  
    })
  });
  /*POST Update Category*/
  router.post('/edit/',(req,res,next)=>{
    const userLogin = req.session.userName;
    const updateCategory = passCatModel.findByIdAndUpdate(req.body.catId,{password_category:req.body.passwordCategory});
    updateCategory.exec((err,data)=>{
      if(err) throw err;
      res.redirect('/categoryList');
    })
  });

  module.exports = router;