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

/* GET Login page. */
router.get('/', (req, res, next) => {
  if(req.session.userName){
    res.redirect('/deshboard');
  }else{
    res.render('index', { title: 'Password Management System', msg:'',err:'' });
  }
});

/* POST Login  */
router.post('/',(req, res, next) => {
  const userDetail = userModel.findOne({username:req.body.username});
        userDetail.exec((err,data)=>{
        if(err) throw err;
        if(bcrypt.compareSync(req.body.password,data.password)){
          var token = jwt.sign({userId: data._id}, 'logintoken');
          localStorage.setItem('usertoken',token);
          localStorage.setItem('userLogin', req.body.username);
          req.session.userName = req.body.username;
          res.redirect('/deshboard');
        }else{
          res.render('index', { title: 'Password Management System', msg:'',err:'Invalid username and password'});
        }         
      }); 
});
module.exports = router;