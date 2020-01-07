const userRouter = require("express").Router();
const userController = require("../../controllers/userController");
const passport = require('passport/lib');

userRouter.post('/register', userController.register);

userRouter.post('/login', userController.login);

userRouter.post('/current',
    passport.authenticate('jwt', {session: false}),
    userController.getCurrentUser);

userRouter.get('/all', userController.getAllUsers);

userRouter.put('/updateEmail', passport.authenticate('jwt', {session: false}),
    userController.updateEmail);

userRouter.put('/updatePassword', passport.authenticate('jwt', {session: false}),
    userController.updatePassword);


module.exports.userRouter = userRouter;