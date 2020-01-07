const db = require('../models');

exports.getAllCategories = (req, res) => {
    db.Category.findAll()
        .then(categories => {
            res.send(categories)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err})
        })
};

exports.getAllCategoriesWithSub = (req, res) => {
    db.Category.findAll({
        include: [
            {
                model: db.SubCategory,
                required: false
            }
        ]
    })
        .then(categories => {
            res.send(categories)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err})
        })
};

exports.addNewCategory = (req, res) => {
    let name = req.body.name;

    let newCategory = {
        name: name
    };

    db.Category.create(newCategory)
        .then(category => {
            res.send(category)
        }).catch(err => {
        console.log(err);
        res.status(500).send({error: "Error while adding new category"});
    })
};

exports.update = (req, res) => {
    let categoryId = req.params.categoryId;
    let name = req.body.name;

    db.Category.update({
        name: name,
    }, {
        where: {
            id: categoryId
        }
    }).then(updatedRowsCount => {
        res.send({updatedRecords: updatedRowsCount})
    }).catch(err => {
        console.log(err);
        res.status(500).send({error: 'Error while updating category: ' + err})
    })
};

exports.deleteCategory = (req, res) => {
    let categoryId = req.params.categoryId;

    db.Category.destroy({
        where: {
            id: categoryId,
        }
    })
        .then(isDeleted => {
            console.log("Is deleted" + isDeleted);
            res.send({deleted: isDeleted})
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: 'Error while deleting category: ' + err})
        })
};