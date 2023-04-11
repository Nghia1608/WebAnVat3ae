const express = require('express');
const router = express.Router();
const {
  verifyUser,
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndUserAuthorization,
  } = require("../app/controllers/Middleware");
const siteController = require('../app/controllers/SiteController');

router.get('/contact',siteController.contact);

router.get('/admin',verifyTokenAndAdmin,siteController.admin);
router.get('/admin1',verifyTokenAndAdmin,siteController.admin1);
router.get('/',verifyUser,siteController.index);


module.exports = router;