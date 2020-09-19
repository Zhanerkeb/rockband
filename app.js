const http = require('http');
const express = require('express');
// const post = require('./Post.js');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const logger =  require('morgan');
const ejs = require('ejs');


const app = express();
app.use(cors());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));


//Include Controllers
const article = require('./routers/api/article');
const user = require('./routers/api/user');
const comment = require('./routers/api/comment');
const category = require('./routers/api/category');
const subCategory = require('./routers/api/subCategory');   
const product = require('./routers/api/product');
const characteristic = require('./routers/api/characteristic');
const subCharList = require('./routers/api/subCharList');
const prodCharList = require('./routers/api/prodCharList');
const search = require('./routers/api/search');
const song = require('./routers/api/song');

const admin = require('./routers/admin/index');


const db = require('./models/index');

db.sequelize.sync({logging: false}).then(() => {
    console.log('Drop and Resync with { force: true }');
});

db.Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
    return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss.SSS');
};

// Passport middleware
app.use(passport.initialize());

app.use(express.static(__dirname + '/public'));


const passportLib = require('passport/lib');
const adminAuth = require('./validation/Auth').isAdmin;

// Passport Config
require('./config/passport')(passport);

app.use('/api/posts', article.articleRouter);
app.use('/api/comments', comment.commentRouter);
app.use('/api/users', user.userRouter);
app.use('/api/category', category.categoryRouter);
app.use('/api/subcategory', subCategory.subCategoryRouter);
app.use('/api/product', product.productRouter);
app.use('/api/characteristic', characteristic.productRouter);
app.use('/api/subCharList', subCharList.productRouter);
app.use('/api/prodCharList', prodCharList.prodCharListouter);
app.use('/api/search', search.searchRouter);
app.use('/api/songs', song.router);

app.use('/api/admin', passportLib.authenticate('jwt', {session: false}),
    adminAuth, admin.router);

app.listen(5000, () => console.log(`Server on port 5000`));