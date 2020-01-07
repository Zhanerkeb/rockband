const db = require('../models');


exports.getAll = (req, res) => {
    db.ProdCharList.findAll()
        .then(prodCharLists => {
            res.send(prodCharLists)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err})
        })
};


exports.add = async (req, res) => {
    try {
        let productId = req.body.productId;
        let charId = req.body.charId;
        let value = req.body.value;

        let product = await db.Product.findByPk(productId);
        let subCategoryId = product.subCategoryId;

        console.log('After db: ' + subCategoryId);

        let subCharRecord = await db.SubCharList.findOne({
            where: {
                subCategoryId: subCategoryId,
                charId: charId
            }
        });

        if(!subCharRecord) {
            return res.status(400).send({error: 'You cannot add value to this characterisitics'})
        }


        let newProdCharList = {
            productId: productId,
            charId: charId,
            value: value,
        };

        db.ProdCharList.create(newProdCharList)
            .then(prodCharList => {
                res.send(prodCharList)
            }).catch(err => {
            console.log(err);
            res.status(500).send({error: "Error while adding new prod char list"});
        })
    } catch (e) {
        res.status(500).send(e)
    }

};

exports.update = (req, res) => {
    let prodCharListId = req.params.prodCharListId;
    let productId = req.body.productId;
    let charId = req.body.charId;
    let value = req.body.value;


    let updatedProdCharList = {
        productId: productId,
        charId: charId,
        value: value,
    };


    db.ProdCharList.update(updatedProdCharList, {
        where: {
            id: prodCharListId
        }
    }).then(updatedRowsCount => {
        res.send({updatedRecords: updatedRowsCount})
    }).catch(err => {
        console.log(err);
        res.status(500).send({error: 'Error while updating category: ' + err})
    })
};

exports.delete = (req, res) => {
    let prodCharListId = req.params.prodCharListId;

    db.Product.destroy({
        where: {
            id: prodCharListId,
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