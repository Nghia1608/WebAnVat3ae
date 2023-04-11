const Products = require('../models/Products');
const ProductsDetails = require('../models/ProductsDetail');

const ProductsInCart = require('../models/UsersCart');
const ProductsToOrder = require('../models/UsersOrders');
const ProductsDetailToOrder = require('../models/UsersOrdersDetails');
const Users = require('../models/Users');

const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose');
const UsersCart = require('../models/UsersCart');


const ProductController = {


    // Method Show - Hien thi san pham
    // [Get] src/routes/product/show
    show(req, res, next) {
        Promise.all([ProductsDetails.find({ idProduct: req.params.id }), Products.findOne({ _id: req.params.id })])
            .then(([productsdetails, products]) => {
                res.render('products/show.hbs', {
                    products: mongooseToObject(products),
                    productsdetails: multipleMongooseToObject(productsdetails),
                });
            })
            .catch((next) => {
                res.send(next)
            });
    },

    create(req, res, next) {
        res.render('products/create.hbs');
    },
    //product detail
    showProductDetail(req, res, next) {
        Promise.all([ProductsDetails.find({ idProduct: req.params.id }), Products.findOne({ _id: req.params.id })])
            .then(([productsdetails, products]) => {
                res.render('products/detail.hbs', {
                    products: mongooseToObject(products),
                    productsdetails: multipleMongooseToObject(productsdetails),
                });
            })
            .catch((next) => {
                res.send(next)
            });

    },
    createDetail(req, res, next) {

        Products.findById(req.params.id)
            .then(products => res.render('products/createDetail.hbs', {
                products: mongooseToObject(products)

            }))
            .catch(next);
    },
    storeDetail(req, res, next) {
        const formData = req.body;
        const productDetail = new ProductsDetails(formData);

        productDetail.giaTienBanRa = req.body.giaTienBanRa;
        productDetail.tinhTrang = req.body.tinhTrang;
        productDetail.soLuongCon = req.body.soLuongCon;
        productDetail.size = req.body.size;
        productDetail.save()
            .then(() => {
                res.redirect(`/products/${req.body.id}/detail`);
                alert('Thêm sản phẩm thành công');
            })
            .catch(error => {
            })
    },
    editDetail(req, res, next) {
        ProductsDetails.findById(req.params.id)
            .then(productsdetails => res.render('products/editDetail.hbs', {
                productsdetails: mongooseToObject(productsdetails)

            }))
            .catch(next);

    },

    //[PUT]
    updateDetail(req, res, next) {
        ProductsDetails.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect(`/products/${req.body.idProduct}/detail`)
            )
            .catch(next);

    },
    deleteDetail(req, res, next) {
        ProductsDetails.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    },
    // [Post] src/routes/product/store  nhan du lieu tu form Create

    storedProducts(req, res, next) {
        Promise.all([Products.find({}), Products.countDocumentsDeleted()])
            .then(([products, deletedProducts]) => {
                res.render('products/storedProducts.hbs', {
                    deletedProducts,
                    products: multipleMongooseToObject(products),

                });
            })
            .catch(next);
    },


    trashProducts(req, res, next) {
        Products.findDeleted({})
            .then((products) => {
                res.render('products/trashProducts.hbs', {
                    products: multipleMongooseToObject(products),

                });
            })
            .catch(next);
    },

    store(req, res, next) {
        const formData = req.body;
        const product = new Products(formData);
        //save values
        product.tenSanPham = req.body.tenSanPham;
        product.image = req.body.image;
        product.image1 = req.body.image1;
        product.image2 = req.body.image2;
        product.image3 = req.body.image3;
        product.moTa = req.body.moTa;
        product.maLoai = req.body.maLoai;
        product.tinhTrang = req.body.tinhTrang;

        //
        product.save()
            .then(() => {
                res.redirect('/products/storedProducts');
            })
            .catch(error => {
                res.send(error)
            })

    },

    //[GET]
    edit(req, res, next) {
        Products.findById(req.params.id)
            .then(products => res.render('products/edit.hbs', {
                products: mongooseToObject(products)

            }))
            .catch(next);
    },

    //[PUT]
    update(req, res, next) {
        Products.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    },
    //[SOFT DELETE]
    softDelete(req, res, next) {
        Products.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    },
    //[RESTORE]
    restore(req, res, next) {
        Products.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    },
    //[DELETE]
    delete(req, res, next) {
        Products.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    //them san pham vao gio hang
    //POST
    storeProductToCart(req, res, next) {
        //show sp theo id user va id sp               
        Promise.all([ProductsInCart.findOne({ idSanPham: req.body.idSP, size: req.body.size, username: req.user.username })])
            .then(([carts]) => {
                if (carts) {

                    //SP đã có trong giỏ =>cộng dồn số lượng
                    //Số lượng đã có
                    let soLuongCurrent = carts.soLuong;
                    let tongTienCurrent = carts.tongTien;

                    //so lượng cộng thêm
                    let soLuongAddIn = req.body.soLuong;
                    let tongTienAddIn = req.body.tongTien;
                    // tổng sau cộng
                    soLuongToTal = parseInt(soLuongCurrent) + parseInt(soLuongAddIn);
                    tongTienToTal = parseInt(tongTienCurrent) + parseInt(tongTienAddIn);
                    //
                    newValues = ({ $set: { soLuong: soLuongToTal, tongTien: tongTienToTal } });

                    ProductsInCart.updateOne({ _id: carts._id }, newValues)
                        .then(() => {
                            res.redirect('/users/cart');

                        })
                        .catch(next);
                } else {
                    //SP chưa có trong giỏ =>thêm mới
                    const formData = req.body;
                    const product = new ProductsInCart(formData);
                    product.username = req.user.username;
                    product.hoTen = req.user.username;
                    product.sdt = req.user.username;
                    product.idSanPham = req.body.idSP;
                    product.save()
                        .then(() => {
                            res.redirect('/users/cart');
                        })
                        .catch(next);
                }
            })
            .catch((next) => {
                res.send(next)
            });
        //res.send(req.body);
    },

    updateCart(req, res, next) {
        //so luong va tien theo ID
        var tempSoLuong = "soLuongForUpdate" + req.params.id;  //soLuong6367847be736a0b3f32b2d95
        var tempTongTien = "tongTienForUpdate" + req.params.id;
        //
        var SoLuong = req.body[tempSoLuong];
        var TongTien = req.body[tempTongTien];
        newValues = ({ $set: { soLuong: SoLuong, tongTien: TongTien } });
        //req.params chi lay dc _id
        //req.body = object
        ProductsInCart.updateOne({ _id: req.params.id }, newValues)
            .then(() => {
                res.redirect('/users/cart');

            })
            .catch(next);


    },
    deleteCart(req, res, next) {
        ProductsInCart.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/users/cart'))
            .catch(next);
    },

    order(req, res, next) {
        const formData = req.body;


        // This arrangement can be altered based on how we want the date's format to appear.
        var tempMHD = Math.floor(Math.random() * 90000000000);
        // thoi gian dat hang
        const dt = new Date();
        const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
        tempThoiGianDatHang = `${padL(dt.getDate())}/${padL(dt.getMonth() + 1)}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`;
        tempThoiGianGiaoHang = `${padL(dt.getDate() + 3)}/${padL(dt.getMonth() + 1)}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`;
        //

        const productOrder = new ProductsToOrder(formData);
        //data productOrder table
        productOrder.username = req.body.username;
        productOrder.hoTen = req.body.hoTen;
        productOrder.sdt = req.body.sdt;
        productOrder.email = req.body.email;
        productOrder.diaChi = req.body.diaChi;
        productOrder.note = req.body.note;
        productOrder.hinhThucMuaHang = req.body.hinhThucMuaHang;
        productOrder.tinhTrang = req.body.tinhTrang;
        productOrder.tongTien = req.body.tongTienGioHang;
        productOrder.maHoaDon = tempMHD;
        productOrder.thoiGianDatHang = tempThoiGianDatHang;
        productOrder.thoiGianGiaoDuKien = tempThoiGianGiaoHang;
        productOrder.save()
        //data productOrderDetail table
        var i;
        if (typeof req.body.idSanPham == "string") {
            const productOrderDetail = new ProductsDetailToOrder(formData);
            productOrderDetail.username = req.body.username;
            productOrderDetail.idSanPham = req.body.idSanPham;
            productOrderDetail.tenSanPham = req.body.tenSanPham;
            productOrderDetail.size = req.body.size;
            productOrderDetail.soLuong = req.body.soLuong;
            productOrderDetail.giaTienBanRa = req.body.giaTienBanRa
            productOrderDetail.maHoaDon = tempMHD;
            productOrderDetail.save();

            let tempSL = req.body.soLuong;
            Promise.all([ProductsDetails.findOne({ idProduct: req.body.idSanPham, size: req.body.size })])
                .then(async ([productsdetails]) => {
                    if (productsdetails) {
                        //Số lượng đã có
                        soLuongCurrent = productsdetails.soLuongCon;
                        //so lượng reduce
                        soLuongReduce = tempSL;
                        // tổng sau cộng
                        soLuongToTal = parseInt(soLuongCurrent) - parseInt(soLuongReduce);
                        //
                        tinhTrangTotal = "Còn hàng";
                        if (soLuongToTal == 0) {
                            tinhTrangTotal = "Tạm hết hàng"
                        }
                        newValues = ({ $set: { soLuongCon: soLuongToTal, tinhTrang: tinhTrangTotal } });
                        temp = (productsdetails._id).toString()
                        await ProductsDetails.updateOne({ _id: temp }, newValues)
                    }
                })
            Promise.all([ProductsInCart.findOne({ idSanPham: req.body.idSanPham, size: req.body.size, username: req.body.username })])
                .then(async ([carts]) => {
                    if (carts) {
                        let temp = (carts._id).toString();
                        //res.send(temp)
                        await ProductsInCart.deleteOne({ _id: temp })
                    }
                })
        } else {
            for (i = 0; i < (req.body.idSanPham).length; i++) {
                if ((req.body.checked[i]) == "true") {
                    const productOrderDetail = new ProductsDetailToOrder(formData);
                    productOrderDetail.username = req.body.username;
                    productOrderDetail.idSanPham = req.body.idSanPham[i];
                    productOrderDetail.tenSanPham = req.body.tenSanPham[i];
                    productOrderDetail.size = req.body.size[i];
                    productOrderDetail.soLuong = req.body.soLuong[i];
                    productOrderDetail.giaTienBanRa = req.body.giaTienBanRa[i];
                    productOrderDetail.maHoaDon = tempMHD;
                    productOrderDetail.save();
                    //reduce amout products in DB after order

                    let tempSL = req.body.soLuong[i];
                    Promise.all([ProductsDetails.findOne({ idProduct: req.body.idSanPham[i], size: req.body.size[i] })])
                        .then(async ([productsdetails]) => {
                            if (productsdetails) {
                                //Số lượng đã có
                                soLuongCurrent = productsdetails.soLuongCon;
                                //so lượng reduce
                                soLuongReduce = tempSL;
                                // tổng sau cộng
                                soLuongToTal = parseInt(soLuongCurrent) - parseInt(soLuongReduce);
                                //
                                tinhTrangTotal = "Còn hàng";
                                if (soLuongToTal == 0) {
                                    tinhTrangTotal = "Tạm hết hàng"
                                }
                                newValues = ({ $set: { soLuongCon: soLuongToTal, tinhTrang: tinhTrangTotal } });
                                temp = (productsdetails._id).toString()
                                await ProductsDetails.updateOne({ _id: temp }, newValues)
                            }
                        })
                    //delete products in cart after order

                    Promise.all([ProductsInCart.findOne({ idSanPham: req.body.idSanPham[i], size: req.body.size[i], username: req.body.username })])
                        .then(async ([carts]) => {
                            if (carts) {
                                let temp = (carts._id).toString();
                                //res.send(temp)
                                await ProductsInCart.deleteOne({ _id: temp })
                            }
                        })
                }
            }
        }

        res.redirect('/users/purchase')
    },

    deleteCartAfterOrder(req, res, next) {
        for (var i = 0; i < (req.body.idSanPham).length; i++) {

            if ((req.body.checked[i]) == "true") {
                Promise.all([ProductsInCart.findOne({ idSanPham: req.body.idSanPham[i], size: req.body.size[i], username: req.body.username })])
                    .then(([carts]) => {
                        if (carts) {
                            let temp = (carts._id).toString();
                            //res.send(temp)
                            ProductsInCart.deleteOne({ _id: temp })
                        } else { res.send("khong co") }

                    })
                    .catch(next)
            }
        }


        res.redirect('/users/cart')

    },
    cancelOrder(req, res, next) {
        Promise.all([ProductsToOrder.findOne({ _id: req.params.id })])
            .then(async ([usersorders]) => {
                Promise.all([ProductsDetailToOrder.find({ maHoaDon: usersorders.maHoaDon })])
                    .then(async ([usersordersdetails]) => {

                        usersordersdetails.forEach(order => {     //lap qua cac phan tu trong mang da lay ra
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
                        //await ProductsDetailToOrder.deleteMany({maHoaDon : usersorders.maHoaDon}),
                        //await ProductsToOrder.deleteOne({_id : req.params.id})
                        setValueForCanceled = ({ $set: { tinhTrang: "Đã hủy bởi người mua" } });
                        await ProductsToOrder.updateOne({ _id: req.params.id }, setValueForCanceled)

                        await ProductsToOrder.delete({ _id: req.params.id })
                    })
            });
        res.redirect('/users/purchase')
    },
}
module.exports = ProductController;