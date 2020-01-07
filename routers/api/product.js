const router = require("express").Router();
const controller = require("../../controllers/productController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin;
const upload = require('../../config/fileUpload').uploadProductImage('image');



router.get('/byFilter', controller.getProductsByFilter)

router.get('/bySubcategory', controller.getProductsBySubCategory);

router.get('/byId/:productId', controller.getProductById);

router.get('/', controller.getAll);

router.post('/', controller.add);

router.put('/:productId', controller.update);

router.delete('/:productId', controller.delete);

module.exports.productRouter = router;
