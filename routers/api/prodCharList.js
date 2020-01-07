const router = require("express").Router();
const controller = require("../../controllers/prodChatListController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin;


router.get('/', controller.getAll);

router.post('/', controller.add);

router.put('/:prodCharListId', controller.update);

router.delete('/:prodCharListId', controller.delete);

module.exports.prodCharListouter = router;
