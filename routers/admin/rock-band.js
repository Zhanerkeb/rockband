const router = require("express").Router();
const controller = require("../../controllers/rock-band-controller");
const multer = require('multer');
const storage = multer.memoryStorage();
const multerUpload = multer({storage: storage});

router.get('/', controller.getAll);

router.get('/with-albums', controller.getWithAlbums);

router.get('/with-songs', controller.getWithSongs);

router.get('/with-country-and-musical-direction', controller.getWithCountryAndMusicalDirection);

router.get('/:id', controller.getById);

router.post('/', multerUpload.single('img'), controller.create);

router.put('/:id', multerUpload.single('img'), controller.update);

router.delete('/:id', controller.delete);

module.exports.router = router;

