const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');


const validateRegisterInput = require('../validation/register');

exports.register = (req, res) => {

    const {errors, isNotValid} = validateRegisterInput(req.body);

    if(isNotValid) {
        return res.status(400).send(errors);
    }

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    db.User.findOne({
        where: {
            email: email
        }
    })
        .then(user => {
            if(user) {
                res.status(400).send({error: "There are already user with this email"})
                return
            }

            const newUser = {
                name: name,
                email: email,
                password: password
            };

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    db.User.create(newUser)
                        .then(user => {
                            res.json(user);
                        })
                        .catch(err => console.log(err))
                })
            })

        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: 'Error while user registration'});
        })


};


exports.login = (req, res) => {
    let errors = {}


    let email = req.body.email;
    let password = req.body.password;

    db.User.findOne({
        where: {
            email: email
        }
    }).then(user =>{
        if(!user) {
            errors.email = "There not user with such email";
            res.status(400).send(errors);
            return;
        }

        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    // User matched

                    // Create JWT Payload
                    const payload = {
                        id: user.id,
                        name: user.name,
                    };

                    // Sign token
                    jwt.sign(
                        payload,
                        keys.passportKey,
                        {expiresIn: 1001101},
                        (err, token) => {
                            res.send({
                                success: true,
                                id: user.id,
                                token: token,
                            });
                        }
                    );
                } else {
                    errors.password = 'Password incorrect';
                    return res.status(400).send(errors);
                }
            })  .catch(err => {
                console.log(err);
                errors.bcrypt = "Error while comparing passwords";
                return res.status(500).send(errors)
            })


    }).catch(err => {
        console.log(err);
        res.status(500).send({error: 'Server error while user authorization'})
    })
};


exports.getCurrentUser = (req, res) => {
    let currentUser = {
        id: req.user.id,
        name: req.user.name
    };

    res.send(currentUser)
};

exports.getAllUsers = (req, res) => {
    db.User.findAll()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: "Error while getting all user list"})
        })
};


exports.updateEmail = (req, res) => {
    let userId = req.user.id;
    let email = req.body.email;

    db.User.findByPk(userId)
        .then(user => {
            if(user.email == email) {
                return res.status(400).send({error: "It is your current email"})
            }

            db.User.update({
                email: email
            },
                {
                    where: {
                        id: userId
                    }
                }
                )
                .then(isUpdated => {
                    res.send({updatesColumns: isUpdated})
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send({error: "Error while updating user email"})
                })
        })
};


exports.updatePassword = (req, res) => {
    let userId = req.user.id;
    let newPassword = req.body.password;
    console.log("I am here");
    errors = {}

    db.User.findByPk(userId)
        .then(user => {
            bcrypt.compare(newPassword, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        return res.status(400).send({error: "Enter another password"});
                    }

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newPassword, salt, (err, hash) => {
                            if (err) {
                                console.log(err);
                                throw err;
                            }
                            db.User.update({
                                password: hash
                            },
                            {
                                where: {
                                    id: userId
                                }
                            })
                                .then(isUpdated => {
                                    res.json({updated: isUpdated});
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        })
                    })
                })
                .catch(err => {
                    console.log(err);
                    errors.bcrypt = "Error while comparing passwords";
                    return res.status(500).send(errors)
                })
        })
        .catch(err => {
            console.log(err);
            res.send(err)
        });
};
