const router = require("express").Router();
const controller = require("../../controllers/performance-controller");

const Model = require('../../models').Performance;

const multer = require('multer');
const storage = multer.memoryStorage();
const multerUpload = multer({storage: storage});
const upload = require('../../middlewares/file').uploadFile('performance');
const update = require('../../middlewares/file').updateFile(Model, 'performance');

router.get('/', controller.getAll);

router.get('/', controller.getFull);

router.get('/:id', controller.getById);

router.post('/', multerUpload.single('img'),
    // upload,
    controller.create);

router.put('/:id', multerUpload.single('img'),
    // update,
    controller.update);

router.delete('/:id', controller.delete);

module.exports.router = router;

