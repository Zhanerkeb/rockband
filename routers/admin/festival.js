const router = require("express").Router();
const controller = require("../../controllers/festival-controller");

const Model = require('../../models').Festival;

const multer = require('multer');
const storage = multer.memoryStorage();
const multerUpload = multer({storage: storage});
const upload = require('../../middlewares/file').uploadFile('festival');
const update = require('../../middlewares/file').updateFile(Model, 'festival');

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.post('/', multerUpload.single('img'), upload, controller.create);

router.put('/:id', multerUpload.single('img'), update, controller.update);

router.delete('/:id', controller.delete);

module.exports.router = router;

