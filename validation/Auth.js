const db = require('../models');

exports.isAdmin = (req, res, next) => {
        let userId = req.user.id;

        db.User.findByPk(userId)
            .then(user => {
                if(user.role !== 'admin') {
                    return res.status(403).send({msg: "Access forbiden"});
                }

                next()
            })
            .catch (e => {
            res.status(500).send({error: "There was some error: " + e.message})
        })

};