const db = require('../models');
const Model = require('../models').Rock_Band;

function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function (result, key) {
        result[key] = mapFn(object[key])
        return result
    }, {})
}

exports.getAll = async (req, res) => {
    try {

        const records = await Model.findAll();
        res.send(records);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

exports.getWithAlbums = async (req, res) => {
    try {

        const records = await Model.findAll({
            include: [{
                model: db.Album
            }]
        });
        res.send(records);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

exports.getWithCountryAndMusicalDirection = async (req, res) => {
    try {

        const records = await Model.findAll({
            include: [{
                    model: db.Musical_direction
                }]
        });
        res.send(records);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

exports.getWithSongs = async (req, res) => {
    try {

        const records = await Model.findAll({
            include: [{
                model: db.Song
            }]
        });
        res.send(records);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

exports.getById = async (req, res) => {
    try {

        let {id} = req.params;
        const record = await Model.findByPk(id);

        res.send(record);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

exports.create = async (req, res) => {
    try {

        const newRecord = await Model.create({
            ...objectMap(req.body, value => {
                return value !== 'null' ? value : null
            }),
            // ...req.body
        });

        res.send(newRecord);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

exports.update = async (req, res) => {
    try {

        let {id} = req.params;

        console.log(req.body);

        const result = await Model.update({
                ...objectMap(req.body, value => {
                    return value !== 'null' ? value : null
                })
            },
            {
                where: {
                    id
                }
            });

        res.send({updated: result[0]});

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};


exports.delete = async (req, res) => {
    try {

        let {id} = req.params;

        const result = await Model.destroy({
            where: {
                id
            }
        });

        res.send({deleted: result});

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

