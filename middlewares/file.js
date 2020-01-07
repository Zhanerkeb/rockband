const fs = require('fs');
const uuidv4 = require('uuid/v4');
const path = require('path');
const DEFAULTS = require('../config/upload').defaults;
const DESTINATIONS = require('../config/upload').destinations;


exports.uploadFile = (name) => {
    return async (req, res, next) => {

        try {

            if (req.file === undefined) {
                req.body.image = DEFAULTS[name];
                return next();
            }

            const buffer = req.file.buffer;

            const filename = uuidv4() + path.extname(req.file.originalname);

            const filepath = DESTINATIONS[name] + filename;

            fs.writeFileSync('public/' + filepath, buffer, 'binary');

            req.body.image = filepath;

            next()

        } catch (err) {

            res.status(422).send(err);

        }
    }
};

exports.updateFile = (Model, name) => {
    return async (req, res, next) => {

        try {

            const record = await Model.findByPk(req.params.id);

            console.log({sf: record.image});

            if(req.file === undefined) {
                req.body.image = record.image;
                return next();
            }

            if(record.image !== DEFAULTS[name]) {
                await fs.unlink('public/' + record.image, function (err) {
                    console.log(err)
                });
            }

            const buffer = req.file.buffer;

            const filename = uuidv4() + path.extname(req.file.originalname);
            const filepath = DESTINATIONS[name] + filename;

            fs.writeFileSync('public/' + filepath, buffer, 'binary');

            req.body.image = filepath;

            next()

        } catch(err) {

            res.status(422).send(err);

        }
    };

};