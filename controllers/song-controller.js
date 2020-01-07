const db = require('../models');
const Model = require('../models').Song;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function (result, key) {
        result[key] = mapFn(object[key]);
        return result
    }, {})
}

exports.getAllSite = async (req, res) => {
    try {

        const queryDate = req.query['date'];
        console.log(queryDate);
        let date = new Date();

        switch (queryDate) {
            case 1:
                date = new Date(date.setDate(date.getDate() - 7));
                break;
            case 2:
                date = new Date(date.setMonth(date.getMonth() - 1));
                break;
            case 3:
                date = new Date(date.setFullYear(date.getFullYear() - 1));
                break;
            case 4:
                date = new Date(date.setFullYear(date.getFullYear() - 100));
                break;
            default:
                date = new Date(date.setDate(date.getDate() - 7));
                break;
        }

        console.log(date);

        const records = await Model.findAll({
            include: [{
                model: db.Rock_Band,
            }, {
                model: db.Album
            }],
            where: {
                // released_date: {
                //     [Op.gt]: date,
                // },
            },
            // order: {
            //     name:
            // }
        });
        res.render('chart', {songs: records, active: queryDate?queryDate:1});

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

exports.search = async (req, res) => {
    try {

        let query = req.query['query'];

        const records = await Model.findAll({
            include: [{
                model: db.Rock_Band,
            }, {
                model: db.Album
            }],

                where: {
                    name: {[Op.like]: "%" + query + "%"},
                },
        });
        res.render('search', {songs: records});

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

exports.getAll = async (req, res) => {
    try {

        const records = await Model.findAll();
        res.send(records);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

exports.getFull = async (req, res) => {
    try {

        const records = await Model.findAll({
            include: [{
                model: db.Rock_Band,
            }, {
                model: db.Album
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
            released_date: req.body.released_date && req.body.released_date !== 'null' ? req.body.released_date.split('.').reverse().join('-') : null
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

        const result = await Model.update({
                ...objectMap(req.body, value => {
                    return value !== 'null' ? value : null
                }),
                released_date: req.body.released_date && req.body.released_date !== 'null' ? req.body.released_date.split('.').reverse().join('-') : null
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

