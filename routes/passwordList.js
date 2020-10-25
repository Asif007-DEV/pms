const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult, Result} = require('express-validator');
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

/**
//Here is pagination with Mongoose paginate package
router.get('/',cheackLogin,(req, res, next) => {
  const userLogin = localStorage.getItem('userLogin');
  const option = {
    offset : 1,
    limit : 3
  }
    addPasswordModel.paginate({},option).then((result)=>{
      res.render('viewPasswordList', { 
        title: 'Password List',
        userLogin:userLogin,
        records:result.docs,
        current:result.offset,
        pages:Math.ceil(result.total / result.limit),
        success:'',
      });
    });
});
router.get('/:page',cheackLogin,(req, res, next) => {
  const userLogin = localStorage.getItem('userLogin');
  var page = req.params.page || 1;
  var option = {
    offset : 1,
    limit : 3
  }
  option.offset = page;
    addPasswordModel.paginate({},option).then((result)=>{
      res.render('viewPasswordList', { 
        title: 'Password List',
        userLogin:userLogin,
        records:result.docs,
        current:result.offset,
        pages:Math.ceil(result.total / result.limit),
        success:'',
      });
    });
});

*/

//here is Pagination is without pagination package
/*GET to view Password  List */
router.get('/',cheackLogin,(req, res, next) => {
    const userLogin = req.session.userName;
    const perPage =3;
    const page = 1;
    getPassword.skip((perPage * page) - perPage)
    .limit(perPage).exec((err,data)=>{
      if(err) throw err;
      addPasswordModel.countDocuments({}).exec((err,count)=>{
        res.render('viewPasswordList', { 
          title: 'Password List',
          userLogin:userLogin,
          records:data,
          current:page,
          pages:Math.ceil(count / perPage),
          success:'',
        });
      });
    });
  });
  router.get('/:page',cheackLogin,(req, res, next) => {
    const userLogin = req.session.userName;
    const perPage =3;
    const page = req.params.page || 1;
    getPassword.skip((perPage * page) - perPage)
    .limit(perPage).exec((err,data)=>{
      if(err) throw err;
      addPasswordModel.countDocuments({}).exec((err,count)=>{
        res.render('viewPasswordList', { 
          title: 'Password List',
          userLogin:userLogin,
          records:data,
          current:page,
          pages:Math.ceil(count / perPage),
          success:'',
        });
      });
    });
  });
  
  /*GET to Delete Password  Details */
  router.get('/delete/:id',cheackLogin,(req, res, next) => {
    const userLogin = req.session.userName;
    const deletePass = addPasswordModel.findByIdAndDelete(req.params.id);
    deletePass.exec((err,doc)=>{
      if(err) throw err;
      res.redirect('/passwordList');
    });
  });
  
  /*GET go to Edit Password  Details page */
  router.get('/edit/:id',cheackLogin,(req, res, next) => {
    const userLogin = req.session.userName;
    const getEditDetails = addPasswordModel.findById(req.params.id);
    getEditDetails.exec((err,data)=>{
      if(err) throw err;
      getPassCat.exec((err,category)=>{
        if(err) throw err;
        res.render('editPassDetails',{title: 'Edit Password Details',userLogin:userLogin,category:category,records:data});
      });
    });
  });
  
  /*POST to Edit Password Details */
  router.post('/edit/',cheackLogin,(req, res, next) => {
    const userLogin = req.session.userName;
    const updatePassDetails = addPasswordModel.findByIdAndUpdate(req.body.Passid,{
      password_category : req.body.editpasswordCategory,
      project_name : req.body.editProjectName,
      add_password_details : req.body.editPasswordDetails,
    });
    updatePassDetails.exec((err,doc)=>{
      console.log(doc);
      if(err) throw err;
      res.redirect('/passwordList');
    });
  });

  module.exports = router;