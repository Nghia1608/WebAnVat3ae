const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');



const Schema = mongoose.Schema;
const Product = new Schema({
    tenSanPham :{type :String ,maxLength : 100},
    image :{type :String},
    image1 :{type :String},
    image2:{type :String},
    image3 :{type :String},
    moTa :{type :String,maxLength : 500},
    maLoai :{type :String,maxLength:100},
    tinhTrang :{type :String,maxLength:100},
   // idPhanLoai :{type :String,maxLength:40},
    // soLuongCon:{type :String,maxLength:20},
    // giaTien :{type :String,maxLength:100},
    slug : {type:String ,slug :'tenSanPham',require:true,unique:true},
  },{
    timestamps : true,
  });

  mongoose.plugin(slug);
  Product.plugin(mongooseDelete,{
    deletedAt :true,
    overrideMethods : 'all',
  });
module.exports = mongoose.model('Products',Product);