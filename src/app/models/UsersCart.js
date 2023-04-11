const mongoose = require('mongoose');



const Schema = mongoose.Schema;
const Cart = new Schema({
    //tt user
    username :{type :String ,maxLength : 50,require:true},
    hoTen :{type :String,maxLength:50,require:true},
    sdt :{type :String,maxLength:12,require:true},
    // tt don hang
    idSanPham :{type :String ,maxLength : 100},
    tenSanPham :{type :String ,maxLength : 100},
    image : {type:String},
    // tt don hang - products details
    size :{type :String ,maxLength : 100},
    soLuong :{type :Number ,maxLength :3},
    tongTien : {type :Number ,maxLength : 100},
    slug : {type :String ,default : function() {
      return Math.floor(Math.random()*900000000300000000000) + 1000000000000000
    },require:true,unique:true},
  },{
    timestamps : true,
  });

module.exports = mongoose.model('carts',Cart);