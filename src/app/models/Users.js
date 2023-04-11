const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const User = new Schema({
    username :{type :String ,maxLength : 50,require:true,unique:true},
    password :{type :String,maxLength:250,require:true},
    quyen :{type :String,maxLength:10,require:true},
    email :{type :String,maxLength:254,require:true},
    hoTen :{type :String,maxLength:50,require:true},
    sdt :{type :String,maxLength:12,require:true},
    diaChi :{type :String,maxLength:150,require:true},
    trangThai:{type :String,maxLength:30,require:true},
  },{
    timestamps : true,
  });

module.exports = mongoose.model('Users',User);