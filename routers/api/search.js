const router = require("express").Router();
const controller = require("../../controllers/searchController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin;



router.get('/', controller.search);

router.get('/product', controller.searchProduct);

router.get('/subCategory', controller.searchSubCategory);

router.get('/category', controller.searchCategory);

module.exports.searchRouter = router;