const router = require("express").Router();
const controller = require("../../controllers/characteristicController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin;



router.get('/', controller.getAll);

router.post('/', controller.add);

router.put('/:characteristicId', controller.update);

router.delete('/:characteristicId', controller.delete);

module.exports.productRouter = router;
