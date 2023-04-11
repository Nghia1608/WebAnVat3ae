const express = require('express');
const router = express.Router();


const productsController = require('../app/controllers/ProductController')
const {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndUserAuthorization,
  } = require("../app/controllers/Middleware");

//product

router.get('/create',verifyTokenAndAdmin,productsController.create);
router.post('/storeProducts',verifyTokenAndAdmin,productsController.store);

router.get('/:id/edit',verifyTokenAndAdmin,productsController.edit);
router.put('/:id',verifyTokenAndAdmin,productsController.update);

router.delete('/:id',verifyTokenAndAdmin,productsController.softDelete);
router.patch('/:id/restore',verifyTokenAndAdmin,productsController.restore);
router.delete('/:id/delete',verifyTokenAndAdmin,productsController.delete);

router.get('/storedProducts',verifyTokenAndAdmin,productsController.storedProducts);
router.get('/trashProducts',verifyTokenAndAdmin,productsController.trashProducts);
//product detail
router.get('/:id/detail',verifyTokenAndAdmin,productsController.showProductDetail);

router.get('/:id/createDetail',verifyTokenAndAdmin,productsController.createDetail);
router.post('/storeDetail',verifyTokenAndAdmin,productsController.storeDetail);

router.get('/:id/editDetail',verifyTokenAndAdmin,productsController.editDetail);
router.put('/:id/updateDetail',verifyTokenAndAdmin,productsController.updateDetail);

router.delete('/:id/deleteDetail',verifyTokenAndAdmin,productsController.deleteDetail);
//update so luong san pham trong kho khi đặt hàng



router.post('/order',verifyToken,productsController.order);
router.delete('/:id/deleteCartAfterOrder',verifyToken,productsController.deleteCartAfterOrder);
router.delete('/:id/cancelOrder',verifyToken,productsController.cancelOrder);


router.post('/:id',verifyToken,productsController.storeProductToCart);
router.put('/:id/updateCart',verifyToken,productsController.updateCart);
router.delete('/:id/deleteCart',verifyToken,productsController.deleteCart);

//router.get('/category/:id',productsController.caterogy);

router.get('/:id',productsController.show);


module.exports = router;