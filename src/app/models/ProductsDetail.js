const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductDetail = new Schema({
    giaTienBanRa :{type :Number ,maxLength : 10},
    soLuongCon :{type :Number ,maxLength : 10},
    tinhTrang :{type :String ,maxLength : 10},
    idProduct : {type :String ,maxLength : 100},
    size : {type :String ,maxLength : 10},
  },{
    timestamps : true,
  });

module.exports = mongoose.model('ProductsDetail',ProductDetail);