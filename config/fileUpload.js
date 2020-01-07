const multer = require('multer');

const storageConfig = multer.diskStorage({

    destination: (req, file, cb) =>{
        cb(null, "media/SubCategoryImages");
    },

    filename: (req, file, cb) =>{
        let name = req.body.name;

        console.log(file.originalname);

        filename = createFileName(file, name)
        req.body.image = 'media/SubCategoryImages/' + filename;
        cb(null, filename);
    }
});

function createFileName(file, name) {
    let i = file.originalname.lastIndexOf('.');
    let ext = i ? file.originalname.substr(i + 1) : 'jpeg';
    name = name.replace(new RegExp(" ", 'g'), "");
    var d = new Date();
    var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "_" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
    let filename = name + date + '.' + ext;
    return filename
}

const productStorageConfig = multer.diskStorage({

    destination: (req, file, cb) =>{
        cb(null, "media/Product/");
    },


    filename: (req, file, cb) =>{
        let name = req.body.name;

        console.log(file.originalname);

        filename = createFileName(file, name)

        req.body.image = 'media/Product/' + filename;
        cb(null, filename);
    }
});


exports.upload = function (fieldName) {
    return multer({storage:storageConfig}).single(fieldName);
};
exports.uploadProductImage = function (fieldName) {
    return multer({storage:productStorageConfig}).single(fieldName);
};
