const Users = require('../models/Users');
const ProductsDetails = require('../models/ProductsDetail');

const ProductsInCart = require('../models/UsersCart');
const ProductsToOrder = require('../models/UsersOrders');
const ProductsDetailToOrder = require('../models/UsersOrdersDetails');

const { response } = require('express');
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const bcrypt = require("bcrypt");
const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose');


const UserController = {


	storedUsers(req, res, next) {
		Users.find()
			.then((users) => {
				res.render('users/storedUsers.hbs', {
					users: multipleMongooseToObject(users),

				});
			})
			.catch(next);
	},        //[GET]
	edit(req, res, next) {

		Users.findById(req.params.id)
			.then(users => {

				var idUserQuyen = req.user.quyen;

				res.render('users/editUser.hbs', {
					users: mongooseToObject(users),
					idUserQuyen: idUserQuyen
				})
			})
			.catch(next);
	},
	//[PUT]
	update: async (req, res, next) => {
		//ma hoa mat khau
		const salt = await bcrypt.genSaltSync(10);
		const hashed = await bcrypt.hashSync(req.body.password.toString(), salt);
		req.body.password = hashed;

		//luu thông tin từ form
		Users.findById(req.params.id)
			.then(async users => {
				//giai ma mat khau cu..sau đó so sanh với mật khẩu cũ user nhập vào
				const validPassword = await bcrypt.compare(
					req.body.oldPassword,
					users.password
				);
				if (validPassword) {
					Users.updateOne({ _id: req.params.id }, req.body)
						.then(() => {
							res.redirect('/auth/login')
						})
						.catch(next);
				}
				else {
					res.redirect('back')
				}
			})



	},
	delete(req, res, next) {
		Users.deleteOne({ _id: req.params.id })
			.then(() => res.redirect('back'))
			.catch(next);
	},

	cart(req, res, next) {
		Promise.all([ProductsInCart.find({ username: req.user.username })
			, Users.findOne({ username: req.user.username })
		])
			.then(([carts, users]) => {
				res.render('users/cart.hbs', {
					users: mongooseToObject(users),
					carts: multipleMongooseToObject(carts),

				});
			})
			.catch(next);
	},
	purchase(req, res, next) {
		if (req.user.quyen == "Admin") {
			Promise.all([ProductsToOrder.find({}).sort({ "_id": -1 })
				, ProductsDetailToOrder.find({})
				, Users.findOne({ username: req.user.username })
			])
				.then(([usersorders, usersordersdetails, users]) => {
					res.render('users/purchase.hbs', {
						users: mongooseToObject(users),
						usersorders: multipleMongooseToObject(usersorders),
						usersordersdetails: multipleMongooseToObject(usersordersdetails),

					});
					usersorders.forEach(order => {     //lap qua cac phan tu trong mang da lay ra
						Promise.all([ProductsDetails.findOne({ idProduct: order['idSanPham'], size: order['size'] })])
							.then(async ([productsdetails]) => {
								if (productsdetails) {
									//Số lượng đã có
									soLuongCurrent = productsdetails.soLuongCon;
									//so lượng reduce
									soLuongReduce = order['soLuong'];
									// tổng sau cộng
									soLuongToTal = parseInt(soLuongCurrent) + parseInt(soLuongReduce);
									//
									if (soLuongToTal > 0) {
										tinhTrangTotal = "Còn hàng";
									}
									newValues = ({ $set: { soLuongCon: soLuongToTal, tinhTrang: tinhTrangTotal } });
									temp = (productsdetails._id).toString()
									await ProductsDetails.updateOne({ _id: temp }, newValues)

									await ProductsDetailToOrder.delete({ maHoaDon: usersorders.maHoaDon })

								}
							})

					})
				})
				.catch(next);
		} else {
			Promise.all([ProductsToOrder.find({ username: req.user.username })
				, ProductsDetailToOrder.find({ username: req.user.username })
				, Users.findOne({ username: req.user.username })
			])
				.then(([usersorders, usersordersdetails, users]) => {
					res.render('users/purchase.hbs', {
						users: mongooseToObject(users),
						usersorders: multipleMongooseToObject(usersorders),
						usersordersdetails: multipleMongooseToObject(usersordersdetails),

					});
				})
				.catch(next);
		}

	},
	purchaseForMonth(req, res, next) {
		ProductsToOrder.aggregate([
			{ $match: { deleted: false } },
			{ $group: { _id: { $substr: ["$thoiGianDatHang", 3, 7] }, tongTien: { $sum: "$tongTien" } } },
			{ $sort: { _id: +1 } },
		])
			.then((usersorders) => {
				var valueForMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

				usersorders.forEach(order => {
					var month = order['_id'].slice(0, 2)
					valueForMonth[Number(month) - 1] = order['tongTien'];
				})
				res.send(valueForMonth);

			})
	},
	canceledPurchase(req, res, next) {
		Promise.all([ProductsToOrder.findDeleted()
			, ProductsDetailToOrder.findDeleted()
			, Users.findOne()
		])
			.then(([usersorders, usersordersdetails, users]) => {
				res.render('users/canceledPurchase.hbs', {
					//users : mongooseToObject(users),
					usersorders: multipleMongooseToObject(usersorders),
					usersordersdetails: multipleMongooseToObject(usersordersdetails),

				});
			})
			.catch(next);
	},
	purchaseDetail(req, res, next) {
		Promise.all([ProductsDetailToOrder.find({ maHoaDon: req.params.id }), ProductsToOrder.findOne({ maHoaDon: req.params.id })])
			.then(([usersordersdetails, usersorders]) => {
				res.render('users/purchaseDetail.hbs', {
					usersorders: mongooseToObject(usersorders),
					usersordersdetails: multipleMongooseToObject(usersordersdetails),
				});
			})
			.catch((next) => {
				res.send(next)
			});

	},
	canceledPurchaseDetail(req, res, next) {
		Promise.all([ProductsDetailToOrder.findDeleted({ maHoaDon: req.params.id }), ProductsToOrder.findDeleted({ maHoaDon: req.params.id })])
			.then(([usersordersdetails, usersorders]) => {
				res.render('users/canceledPurchaseDetail.hbs', {
					usersorders: multipleMongooseToObject(usersorders),
					usersordersdetails: multipleMongooseToObject(usersordersdetails),
				});
			})
			.catch((next) => {
				res.send(next)
			});

	},
}
module.exports = UserController;

