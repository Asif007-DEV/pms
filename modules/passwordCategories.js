var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser: true , useCreateIndex: true });

var passCategories = new mongoose.Schema({
    password_category : {type:String,required:true,index:{unique:true}},
    date : {type:Date,default:Date.now}
});

var CategoryModel = mongoose.model('passwordCategories',passCategories);

module.exports = CategoryModel;