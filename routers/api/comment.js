const commentRouter = require("express").Router();
const commentController = require("../../controllers/commentController");
const passport = require('passport/lib');

commentRouter.get('/', commentController.getAllComments);

commentRouter.get('/:commentId', commentController.getCommentById);

commentRouter.post('/',
    passport.authenticate('jwt', {session: false}),
    commentController.addNewComment );

commentRouter.put('/:commentId',
    passport.authenticate('jwt', {session: false}),
    commentController.updateComment);

// commentRouter.delete('/:articleId', commentController.deleteArticle);

module.exports.commentRouter = commentRouter;