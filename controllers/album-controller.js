const Model = require('../models').Album;

function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function(result, key) {
        result[key] = mapFn(object[key]);
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

exports.getByRockBandId = async (req, res) => {
    try {

        let {rock_band_id} = req.params;
        const records = await Model.findAll({
            where: {
                rock_band_id
            }
        });

        res.send(records);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

exports.create = async (req, res) => {
    try {

        console.log(req.body);

        const newRecord = await Model.create({
            ...objectMap(req.body, value => { return value !== 'null' && value !== 'undefined' && value !== '' ?  value:null}),
            released_date: req.body.released_date && req.body.released_date !== 'null' ? req.body.released_date.split('.').reverse().join('-'):null
        });

        res.send(newRecord);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

exports.update = async (req, res) => {
    try {

        console.log(req.body);

        let {id} = req.params;

        const result = await Model.update({
                ...objectMap(req.body, value => { return value !== 'null' && value !== 'undefined' && value !== '' ? value:null}),
                released_date: req.body.released_date && req.body.released_date !== 'null'? req.body.released_date.split('.').reverse().join('-'):null
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

