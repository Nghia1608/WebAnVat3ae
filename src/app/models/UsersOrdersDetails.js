const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');



const Schema = mongoose.Schema;
const UsersOrderDetail = new Schema({
    //tt user
    username :{type :String ,maxLength : 50,require:true},
    //
    maHoaDon : {type :String,maxLength : 50 ,require:true},

    idSanPham :{type :String ,maxLength : 100},
    tenSanPham :{type :String ,maxLength : 100},
    size:{type :String,maxLength:20},
    soLuong:{type :Number,maxLength:20},
    giaTienBanRa :{type :Number,maxLength:100},
  },{
    timestamps : true,
  });
  mongoose.plugin(slug);
  UsersOrderDetail.plugin(mongooseDelete,{
    deletedAt :true,
    overrideMethods : 'all',
  });
module.exports = mongoose.model('UsersOrdersDetails',UsersOrderDetail);