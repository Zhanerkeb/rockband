const router = require("express").Router();
const controller = require("../../controllers/song-controller");

const Model = require('../../models').Song;

const multer = require('multer');
const storage = multer.memoryStorage();
const multerUpload = multer({storage: storage});
const upload = require('../../middlewares/file').uploadFile('song');
const update = require('../../middlewares/file').updateFile(Model, 'song');

router.get('/', controller.getAll);

router.get('/full', controller.getFull);

router.get('/:id', controller.getById);

router.post('/', multerUpload.single('img'), upload, controller.create);

router.put('/:id', multerUpload.single('img'), update, controller.update);

router.delete('/:id', controller.delete);

module.exports.router = router;

