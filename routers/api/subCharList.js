const router = require("express").Router();
const controller = require("../../controllers/subCharListController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin;


router.get('/', controller.getAll);

router.post('/', controller.add);

router.put('/:subCharListId', controller.update);

router.delete('/:subCharListId', controller.delete);

module.exports.productRouter = router;
