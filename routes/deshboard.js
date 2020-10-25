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
  // try{
    if(req.session.userName){
      jwt.verify(token,'logintoken');
    }else{
      res.render('index', { title: 'Password Management System', msg:'',err:'you need to login' });
    }
  // }catch(err){
  //   res.render('index', { title: 'Password Management System', msg:'',err:'you need to login' });
  // }  
  next();
}

/* GET after Login render to deshboard  */
router.get('/', cheackLogin,(req, res, next) => {
    var userLogin = req.session.userName;
    res.render('deshboard', {title:'Deshboard', userLogin:userLogin });
});

  module.exports = router;