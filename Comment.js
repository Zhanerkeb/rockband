let Comments = [
    {
        id: 1,
        content: "Comment 1",
        articleID: 1
    },
    {
        id: 2,
        content: "Comment 2",
        articleID: 1
    },
    {
        id: 3,
        content: "Comment 3",
        articleID: 2
    },
    {
        id: 4,
        content: "Comment 4",
        articleID: 3
    }
];


module.exports.getAllComments = () => {
    return Comments;
};

module.exports.getPostComments = (articleID) => {
    return Comments.filter((comment) => {
        return comment.articleID == articleID
    })
};

module.exports.getCommentById = (commentId) => {
    return Comments.filter((comment) => {
        return comment.id == commentId
    })
};

module.exports.addComment = (content, articleID) => {
    id = getLastId() + 1;

    newComment = {
        id,
        content,
        articleID
    };



    Comments.push(newComment);

    return newComment
};

function getLastId() {
    return Comments[Comments.length - 1].id
}