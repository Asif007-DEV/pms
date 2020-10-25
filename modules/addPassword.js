var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser: true , useCreateIndex: true });

var addPasswordSchema = new mongoose.Schema({
    password_category : {type:String,required:true},
    project_name : {type:String,required:true},
    add_password_details : {type:String,required:true},
    date : {type:Date,default:Date.now}
});
addPasswordSchema.plugin(mongoosePaginate);
var addPasswordModel = mongoose.model('user_passwords',addPasswordSchema);

module.exports = addPasswordModel;