const router = require("express").Router();
const controller = require("../../controllers/album-controller");

const Model = require('../../models').Album;

const multer = require('multer');
const storage = multer.memoryStorage();
const multerUpload = multer({storage: storage});
const upload = require('../../middlewares/file').uploadFile('album');
const update = require('../../middlewares/file').updateFile(Model, 'album');

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.get('/by-rock-band/:rock_band_id', controller.getByRockBandId);

router.post('/', multerUpload.single('img'), upload, controller.create);

router.put('/:id', multerUpload.single('img'), update, controller.update);

router.delete('/:id', controller.delete);

module.exports.router = router;

