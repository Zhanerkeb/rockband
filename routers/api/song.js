const router = require("express").Router();
const controller = require("../../controllers/song-controller");

router.get('/search', controller.search);

router.get('/site', controller.getAllSite);

router.get('/', controller.getAll);

router.get('/full', controller.getFull);

router.get('/:id', controller.getById);

router.post('/', controller.create);

router.put('/:id', controller.update);

router.delete('/:id', controller.delete);

module.exports.router = router;

