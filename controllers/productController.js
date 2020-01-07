const db = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

exports.getProductsBySubCategory = (req, res) => {
    console.log(req.body);
    const limit = 3;

    let subCategoryId = req.body.subCategoryId;

    let page = 1;

    if(parseInt(req.query['page'])) {
        if(parseInt(req.query['page']) > 0) {
            page = parseInt(req.query['page'])
        }
    }


    db.Product.findAll({
        where: {
            subCategoryId: subCategoryId
        },
        limit: limit,
        offset: limit * (page - 1)
    })
        .then(products => {
            db.Product.findOne({
                attributes: [
                    [sequelize.fn('count', sequelize.col('id')), 'total']
                ]
            })
                .then(total => {
                    res.send({products: products, total: total})
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send({error: err})
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err})
        })
};

exports.getProductById = (req, res) => {
    let productId = req.params.productId;

    db.Product.findByPk(productId, {
        include: [
            {
                model: db.ProdCharList,
                attributes: ['value'],
                as: 'Characteristics',
                raw: true,
                include: [
                    {
                        model: db.Characteristic,
                        attributes: ['name', 'unit'],
                    }
                ],
            }
        ],
    })
        .then(product => {
            res.send(product)
        })
        .catch(err => {
            console.log(err);
            res.send(err)
        })
};

exports.getProductsByFilter = async (req, res) => {
    try {
        let subCategoryId = req.body.subCategoryId;

        let chars = await db.SubCharList.findAll({
            attributes: ['charId'],
            where: {
                subCategoryId: subCategoryId
            }
        });

        let query = geterateQuery(req.query, chars)
        console.log(query);

        let products = await db.Product.findAll({
            where: {
                subCategoryId: subCategoryId
            },

            include: [
                {
                    model: db.ProdCharList,
                    as: 'Characteristics',
                    required: true,
                    // where:  eval(query)
                    where: sequelize.and(
                        sequelize.or(
                            {charId: 1,
                                value: '6.5'
                            },
                            {charId: 1,
                                value: '7'
                            },
                        ),
                        sequelize.or(
                            {charId: 2,
                                value: '3'
                            },
                            {charId: 2,
                                value: '12'
                            },
                        ),
                    )

                }
            ]
        });
        res.send({products: products, query: query})
    }catch (e) {
        console.log(e);
    }

};

exports.getAll = (req, res) => {
    db.Product.findAll()
        .then(products => {
            res.send(products)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err})
        })
};

exports.add = (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let price = req.body.price;
    let subCategoryId = req.body.subCategoryId;

    let newProduct = {
        name: name,
        image: image,
        description: description,
        price: price,
        subCategoryId: subCategoryId
    };

    db.Product.create(newProduct)
        .then(product => {
            res.send(product)
        }).catch(err => {
        console.log(err);
        res.status(500).send({error: "Error while adding new product"});
    })
};

exports.update = (req, res) => {
    let productId = req.params.productId;
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let price = req.body.price;
    let subCategoryId = req.body.subCategoryId;

    let updatedProduct = {
        name: name,
        image: image,
        description: description,
        price: price,
        subCategoryId: subCategoryId
    };


    db.Product.update(updatedProduct, {
        where: {
            id: productId
        }
    }).then(updatedRowsCount => {
        res.send({updatedRecords: updatedRowsCount})
    }).catch(err => {
        console.log(err);
        res.status(500).send({error: 'Error while updating category: ' + err})
    })
};

exports.delete = (req, res) => {
    let productId = req.params.productId;

    db.Product.destroy({
        where: {
            id: productId,
        }
    })
        .then(isDeleted => {
            console.log("Is deleted" + isDeleted);
            res.send({deleted: isDeleted})
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: 'Error while deleting product: ' + err})
        })
};


function geterateQuery(queries, chars) {
    let andQuery = "sequelize.and(";

    console.log(queries);

    for (let i = 0; i < chars.length; i++) {
        char = chars[i];
        let values = queries[char.charId];
        if (!values) {
            continue
        }
        let orQuery = "sequelize.or(";
        for (let j = 0; j < values.length; j++) {
            let value = values[j];
            orQuery += '{ charId: ' + char.charId + ',value: \'' + value + '\'},'
        }
        orQuery += '),';

        andQuery += orQuery
    }

    andQuery += ")"
    return andQuery
}