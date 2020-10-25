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



/*GET go to Add New Password page*/
router.get('/',cheackLogin,(req, res, next) => {
  var userLogin = req.session.userName;
  getPassCat.exec((err,data)=>{
    if(err) throw err;
    res.render('addNewPassword', { title: 'Add New Password',records:data,userLogin:userLogin,success:''});
  });
});

/*POST to Add New Password page's and data store in database */
router.post('/',(req, res, next) => {
  var userLogin = req.session.userName;
  const addPasswordData = new addPasswordModel({
    password_category : req.body.passwordCategory,
    project_name : req.body.projectName,
    add_password_details : req.body.addPasswordDetails,
  });
  addPasswordData.save((err,doc)=>{
    if(err) throw err;
    getPassCat.exec((err,data)=>{
      if(err) throw err;
      res.render('addNewPassword', { title: 'Add New Password',records:data,userLogin:userLogin,success:'Insert Details Successfully'});
    });
  });
});

  module.exports = router;