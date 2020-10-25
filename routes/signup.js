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
/* GET Signup page. */
router.get('/',(req, res, next) => {
    if(req.session.userName){
      res.redirect('/deshboard');
    }else{
      res.render('signup', { title: 'Password Management System', msg:'',error:''});
    }
  });
  /* checkUname() method for verify is Username already exist in database */
  const checkUname = (req,res,next) => {
    const username = userModel.findOne({username:req.body.username}); 
    username.exec((err,data)=>{
        if(err) throw err;
        if(data){
          return  res.render('signup', { title:'Password Management System' ,msg:'',error:'Username already exist' });
        }else{
          next();
        }
    });
  }
  /* checkEmail() method for verify is Email already exist in database */
  const checkEmail = (req,res,next)=>{
    const email = userModel.findOne({email:req.body.email});
    email.exec((err,data)=>{
      if(err) throw err;
      if(data){
        return  res.render('signup', { title:'Password Management System' ,msg:'',error:'Email already exist'});
      }else{
        next();
      }
    });
  }
  /*checkpassword() to validate password */
  const checkpassword = (req,res,next)=> {
    const password = req.body.password;
    const confpassword = req.body.confpassword;
    if(password.length < 5){
     return res.render('signup', { title: 'Password Management System',msg:'',error:'Password is too short'});
    }else if(password != confpassword){
      res.render('signup', { title: 'Password Management System',msg:'',error:'Password does not match'});
    }else{
      next();
    }
  }
  /* POST Signup page. to save user data in database */
  router.post('/',checkUname,checkEmail,checkpassword,(req, res, next) => {
    const password = bcrypt.hashSync(req.body.password,10);
    const userDetails = new userModel({
      username : req.body.username,
      email : req.body.email,
      password : password
    });
      userDetails.save((err,doc) => {
        if(err) throw err;
        res.render('signup', { title: 'Password Management System',msg:'Signup successfully',error:''});
      });  
  });

  module.exports = router;