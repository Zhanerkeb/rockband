const db = require('../models');
const sequelize = require('sequelize');

exports.getAll = (req, res) => {
    db.Characteristic.findAll()
        .then(characteristics => {
            res.send(characteristics)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err})
        })
};

exports.add = (req, res) => {
    let name = req.body.name;
    let unit = req.body.unit;

    let newCharacteristic = {
        name: name,
        unit: unit
    };

    db.Characteristic.create(newCharacteristic)
        .then(characteristic => {
            res.send(characteristic)
        }).catch(err => {
        console.log(err);
        res.status(500).send({error: "Error while adding new characteristic"});
    })
};

exports.update = (req, res) => {
    let characteristicId = req.params.characteristicId;

    let name = req.body.name;
    let unit = req.body.unit;

    let updatedCharacteristic = {
        name: name,
        unit: unit
    };


    db.Characteristic.update(updatedCharacteristic, {
        where: {
            id: characteristicId
        }
    }).then(updatedRowsCount => {
        res.send({updatedRecords: updatedRowsCount})
    }).catch(err => {
        console.log(err);
        res.status(500).send({error: 'Error while updating characteristic: ' + err})
    })
};

exports.delete = (req, res) => {
    let characteristicId = req.params.characteristicId;

    db.Product.destroy({
        where: {
            id: characteristicId,
        }
    })
        .then(isDeleted => {
            console.log("Is deleted" + isDeleted);
            res.send({deleted: isDeleted})
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: 'Error while deleting characteristic: ' + err})
        })
};