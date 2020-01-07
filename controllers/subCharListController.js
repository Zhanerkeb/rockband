const db = require('../models');
const sequelize = require('sequelize');


exports.getAll = (req, res) => {
    db.SubCharList.findAll()
        .then(list => {
            res.send(list)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err})
        })
};

exports.add = (req, res) => {
    let subcategoryId = req.body.subcategoryId;
    let charId = req.body.charId;

    let newSubCharList = {
        subCategoryId: subcategoryId,
        charId: charId
    };

    db.SubCharList.create(newSubCharList)
        .then(list => {
            res.send(list)
        }).catch(err => {
        console.log(err);
        res.status(500).send({error: "Error while adding new SubCharList"});
    })
};

exports.update = (req, res) => {
    let subCharListId = req.params.subCharListId;
    let subcategoryId = req.body.subcategoryId;
    let charId = req.body.charId;


    let updatedSubCharList = {
        subCategoryId: subcategoryId,
        charId: charId
    };


    db.SubCharList.update(updatedSubCharList, {
        where: {
            id: subCharListId
        }
    }).then(updatedRowsCount => {
        res.send({updatedRecords: updatedRowsCount})
    }).catch(err => {
        console.log(err);
        res.status(500).send({error: 'Error while updating SubCharList: ' + err})
    })
};

exports.delete = (req, res) => {
    let subCharListId = req.params.subCharListId;

    db.SubCharList.destroy({
        where: {
            id: subCharListId,
        }
    })
        .then(isDeleted => {
            console.log("Is deleted" + isDeleted);
            res.send({deleted: isDeleted})
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: 'Error while deleting SubCharList: ' + err})
        })
};