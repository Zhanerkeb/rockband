const db = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

let resultsPerPage = {
    product: 4,
    category: 2,
    subCategory: 3
};

exports.search = async (req, res) => {
    try {
        let query = req.body.query?req.body.query:"";

        let productsCount = await db.Product.findOne({
            where: sequelize.or(
                { name: {[Op.like]: "%" + query + "%"} } ,
                { description: {[Op.like]: "%" + query + "%"} }
            ),
            attributes: [
                [sequelize.fn('count', sequelize.col('id')), 'total']
            ],
        });


        let products = await db.Product.findAll({
            where: sequelize.or(
                { name: {[Op.like]: "%" + query + "%"} } ,
                { description: {[Op.like]: "%" + query + "%"} }
            ),
            limit: resultsPerPage.product
        });


        let subCategoriesCount = await db.SubCategory.findOne({
            where: {
                name: {[Op.like]: "%" + query + "%"},
            },
            attributes: [
                [sequelize.fn('count', sequelize.col('id')), 'total']
            ]
        });

        let subCategories = await db.SubCategory.findAll({
            where: {
                name: {[Op.like]: "%" + query + "%"},
            },
            limit: resultsPerPage.subCategory
        });


        let categoriesCount = await db.Category.findOne({
            where: {
                name: {[Op.like]: "%" + query + "%"},
            },
            attributes: [
                [sequelize.fn('count', sequelize.col('id')), 'total']
            ]
        });

        let categories = await db.Category.findAll({
            where: {
                name: {[Op.like]: "%" + query + "%"},
            },
            limit: resultsPerPage.category
        });

        // res.send({products: products, subCategories: subCategories, categories: categories})

        console.log(productsCount);
        res.send({
            products: {
                results: products,
                total: Math.ceil(productsCount.dataValues.total / resultsPerPage.product)
            },
            subCategories: {
                results: subCategories,
                total: Math.ceil(subCategoriesCount.dataValues.total / resultsPerPage.subCategory)
            },
            categories: {
                results: categories,
                total: Math.ceil(categoriesCount.dataValues.total / resultsPerPage.category)
            }
        })

    }catch (e) {
        console.log(e);
        res.send(e)
    }

};

exports.searchProduct = async (req, res) => {
    try {
        let query = req.query["query"]?req.query["query"]:""

        let page = 1;
        if(parseInt(req.query['page'])) {
            if(parseInt(req.query['page']) > 0) {
                page = parseInt(req.query['page'])
            }
        }


        let products = await db.Product.findAll({
            where: sequelize.or(
                { name: {[Op.like]: "%" + query + "%"} } ,
                { description: {[Op.like]: "%" + query + "%"} }
            ),

            limit: resultsPerPage.product,
            offset: resultsPerPage.product * (page - 1)

        });

        res.send(products);
    }catch (e) {
        console.log(e);
        res.send(e)
    }

};


exports.searchCategory = async (req, res) => {
    try {
        let query = req.query["query"]?req.query["query"]:""

        let page = 1;
        if(parseInt(req.query['page'])) {
            if(parseInt(req.query['page']) > 0) {
                page = parseInt(req.query['page'])
            }
        }


        let categories = await db.Category.findAll({
            where: {
                name: {[Op.like]: "%" + query + "%"}
                } ,
            limit: resultsPerPage.category,
            offset: resultsPerPage.category * (page - 1)

        });

        res.send(categories);
    }catch (e) {
        console.log(e);
        res.send(e)
    }
};

exports.searchSubCategory = async (req, res) => {
    try {
        let query = req.query["query"]?req.query["query"]:""

        let page = 1;
        if(parseInt(req.query['page'])) {
            if(parseInt(req.query['page']) > 0) {
                page = parseInt(req.query['page'])
            }
        }


        let subCategories = await db.SubCategory.findAll({
            where: {
                name: {[Op.like]: "%" + query + "%"}
            } ,
            limit: resultsPerPage.subCategory,
            offset: resultsPerPage.subCategory * (page - 1)

        });

        res.send(subCategories);
    }catch (e) {
        console.log(e);
        res.send(e)
    }
};

