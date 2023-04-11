const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');



const Schema = mongoose.Schema;
const UsersOrder = new Schema({
    //tt user
    maHoaDon : {type :String,maxLength : 50 ,require:true},

    username :{type :String ,maxLength : 50,require:true},
    hoTen :{type :String ,maxLength : 50,require:true},
    sdt : {type :String ,maxLength : 20,require:true},
    diaChi : {type :String ,maxLength : 150,require:true},
    email : {type :String ,maxLength : 150,require:true},
    note : {type :String ,maxLength : 150,require:true},
    // tt don hang
    // tongTienTruocGiamGia : {type :String ,maxLength : 100},
    // tongTienKhuyenMai : {type :String ,maxLength : 100},
    // hinhThucThanhToan : {type :String ,maxLength : 100},
    hinhThucMuaHang : {type :String ,maxLength : 100},
    tongTien : {type :Number ,maxLength : 100},
    thoiGianDatHang : {type :String ,maxLength : 100},
    thoiGianGiaoDuKien : {type :String ,maxLength : 100},

    tinhTrang:  {type :String ,maxLength : 100},
    // slug : {type :String ,default : function() {
    //   return Math.floor(Math.random()*900000000300000000000) + 1000000000000000
    // },require:true,unique:true},
    
  },{
    timestamps : true,
  });
  mongoose.plugin(slug);
  UsersOrder.plugin(mongooseDelete,{
    deletedAt :true,
    overrideMethods : 'all',
  });
  
module.exports = mongoose.model('UsersOrders',UsersOrder);