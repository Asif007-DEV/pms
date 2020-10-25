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

/*GET to Add New Password Category page*/
router.get('/',cheackLogin,(req, res, next) => {
    var userLogin = req.session.userName;
    res.render('addNewPasswordCategory', { title: 'Add New Password Category',userLogin:userLogin,errors:'',success:''});
  });
  /*Post to Add New Password Category*/
  router.post('/',cheackLogin,[check('passwordCategory','Enter password category').isLength({min: 2})] , (req, res, next) => {
    var userLogin = req.session.userName;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.render('addNewPasswordCategory', { title: 'Add New Password Category',userLogin:userLogin,errors:errors.mapped(),success:''});
    }else{
      const passCatDetails = new passCatModel({
        password_category:req.body.passwordCategory
      });
      passCatDetails.save((err,doc)=>{
        if(err) throw err;
        res.render('addNewPasswordCategory', { title: 'Add New Password Category',userLogin:userLogin,errors:'',success:'Add Category Successfully'});
      });
    }
  });

  module.exports = router;