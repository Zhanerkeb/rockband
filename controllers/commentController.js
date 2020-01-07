const db = require('../models');

// @route   GET comments/
// @params
// @desc    Return all comments
// @access  Private-Admin
exports.getAllComments = (req, res) => {
    db.Comment.findAll()
        .then(comments => {
            res.send(comments)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err})
        })
};


// @route   GET comments/:commentId
// @params
//          commentId: id of comment
// @desc    Return comment by Id
// @access  Public
exports.getCommentById =  (req, res) => {
    res.send(Comment.getCommentById(req.params.commentId))
};

exports.addNewComment =  (req, res) => {
    let content = req.body.content;
    let articleId = req.body.articleId;
    let userId = req.user.id;

    db.Comment.create({
        content,
        articleId,
        userId
    })
        .then(comment => {
            res.send(comment)
        })
        .catch(err => {
            res.status(500).send({error: "Error while creating new comment: " + err})
        })
};

exports.updateComment = (req, res) => {
    let commentId = req.params.commentId;
    let content = req.body.content;
    let userId = req.user.id;


    db.Comment.findByPk(commentId)
        .then(comment => {
            if(comment.userId !== userId) {
                return res.status(403).send({error: "You cannot update this comment"});
            }

            db.Comment.update({
                    content: content
                },
                {
                    where: {
                        id: commentId
                    }
                })
                .then(isUpdated => {
                    res.send({isUpdated: isUpdated})
                })
                .catch(err => {
                    res.send({error: "Error while updating comment"})
                })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({error: "Error while searching comment by user id"})
        });
};
