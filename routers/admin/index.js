const router = require("express")();


const musicalDirection = require('./musical_direction').router;
const rockBand = require('./rock-band').router;
const song = require('./song').router;
const album = require('./album').router;
const festival = require('./festival').router;
const performance = require('./performance').router;
const country = require('./country').router;


router.use('/musical-directions', musicalDirection);
router.use('/rock-bands', rockBand);
router.use('/songs', song);
router.use('/albums', album);
router.use('/festivals', festival);
router.use('/performances', performance);
router.use('/countries', country);

module.exports.router = router;

