const db = require('../models');
const Model = require('../models').Festival;

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

exports.create = async (req, res) => {
    try {

        let datetime = req.body.time && req.body.time !== 'null' ? req.body.time : null;
        if(datetime) {
            let [date, time] = datetime.split(' ');
            datetime = date.split('.').join('-') + ' ' + time;
            console.log(datetime);
        }

        const newRecord = await Model.create({
            ...objectMap(req.body, value => { return value !== 'null' ? value:null}),
            time: req.body.time && req.body.time !== 'null' ? req.body.time : null,
            date: req.body.date && req.body.date !== 'null' ? req.body.date : null
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

        let datetime = req.body.time && req.body.time !== 'null' ? req.body.time : null;
        if(datetime) {
            let [date, time] = datetime.split(' ');
            console.log({date});
            console.log({time});
            datetime = date.split('.').join('-') + ' ' + time + '.000';
            console.log(datetime);
        }

        const result = await Model.update({
                ...objectMap(req.body, value => { return value !== 'null' ? value:null}),
                time: req.body.time && req.body.time !== 'null' ? req.body.time : null,
                date: req.body.date && req.body.date !== 'null' ? req.body.date : null
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

