const articleRouter = require("express").Router();
const articleController = require("../../controllers/articleController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin

articleRouter.get('/', articleController.getAllArticles);

articleRouter.get('/:articleId', articleController.getPostById);

articleRouter.post('/', passport.authenticate('jwt', {session: false}),
    adminAuth,
    articleController.addNewArticle);

articleRouter.put('/', passport.authenticate('jwt', {session: false}), adminAuth, articleController.updateArticle);

articleRouter.delete('/:articleId', articleController.deleteArticle);

module.exports.articleRouter = articleRouter;

