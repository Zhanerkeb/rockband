const db = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;



exports.getFiltersOfSubCategory = (req, res) => {
    let subCategoryId = req.params.subCategoryId;

    db.Characteristic.findAll({
        // attributes: [
        //     'name',
        //     'unit',
        //     // "ProdCharLists.value",
        //     'id',
        //     // ['ProdCharLists.value', 'value'],
        //     [sequelize.fn('count', sequelize.col('ProdCharLists.value')), 'totalProduct'],
        //     // [sequelize.fn('distinct', sequelize.col('ProdCharLists.value')), 'products']
        // ],

        include: [
            {
                model: db.SubCharList,
                attributes: [],
                required: true,
                include: [],
                where: {
                    // "$SubCategory.id$": subCategoryId
                    subCategoryId: subCategoryId
                }
            },
            {
                model: db.ProdCharList
                ,
                // attributes: [],
                // attributes: ['value', "id", [sequelize.fn('count', sequelize.col('value')), 'totalProduct']],
                // attributes: [[sequelize.fn('distinct', sequelize.col('ProdCharLists.value')), 'products']].concat(Object.keys(db.ProdCharList.rawAttributes)),
                required: false,
                // group: ["ProdCharLists.id", 'ProdCharLists.value']
            },
        ],

        // group: ["Characteristic.id", "name", 'unit', "ProdCharLists.value"],

    })
        .then(filters => {
            res.send({filters})
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err)
        })
};

exports.getSubCategoriesOfCategory = (req, res) => {
    let categoryId = req.body.categoryId;

    db.SubCategory.findAll({
        where: {
            categoryId: categoryId
        }
    })
        .then(subcategories => {
            res.send(subcategories)
        })
        .catch(err=>{
            console.log(err);
            res.status(500).send({error: err})
        });
};

exports.getAllSubCategories = (req, res) => {
    db.SubCategory.findAll()
        .then(subCategories => {
            res.send(subCategories)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err})
        })
};

exports.addNewSubCategory = async (req, res) => {
    try {
        let name = req.body.name;
        let image = req.body.image;
        let categoryId = req.body.categoryId;

        let category = await db.Category.findByPk(categoryId);

        if(!category) {
            return res.status(400).send({error: "There is no category with this id"})
        }


        let newSubCategory = {
            name: name,
            image: image,
            categoryId: categoryId
        };

        db.SubCategory.create(newSubCategory)
            .then(subCategory => {
                res.send(subCategory)
            }).catch(err => {
            console.log(err);
            res.status(500).send({error: "Error while adding new subcategory"});
        })
    } catch (e) {
        console.log(e);
    }

};


exports.update = (req, res) => {
    let subcategoryId = req.params.subcategoryId;
    let name = req.body.name;
    let image = req.body.image;
    let categoryId = req.body.categoryId;

    db.SubCategory.update({
        name: name,
        image: image,
        categoryId: categoryId
    }, {
        where: {
            id: subcategoryId
        }
    }).then(updatedRowsCount => {
        res.send({updatedRecords: updatedRowsCount})
    }).catch(err => {
        console.log(err);
        res.status(500).send({error: 'Error while updating subcategory: ' + err.message})
    })
};

exports.deleteSubCategory = (req, res) => {
    let subcategoryId = req.params.subcategoryId;

    db.SubCategory.destroy({
        where: {
            id: subcategoryId,
        }
    })
        .then(isDeleted => {
            console.log("Is deleted" + isDeleted);
            res.send({deleted: isDeleted})
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: 'Error while deleting subcategory: ' + err})
        })
};