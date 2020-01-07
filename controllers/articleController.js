const db = require('../models');

exports.getAllArticles = (req, res) => {
    db.Article.findAll()
        .then(articles => {
            res.send(articles)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err})
        })
};

exports.getPostById = (req, res) => {
    let articleId = req.params.articleId;

    db.Article.findByPk(articleId, {
        include: [{
            model: db.Comment,
            required: false
        }],
    })
        .then(article => {
            if(!article) {
                res.status(404).send({error: 'There not such article'});
                return;
            }
            res.send(article)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err})
        })
};

exports.addNewArticle = (req, res) => {
    let title = req.body.title;
    let content = req.body.content;

    let newArticle = {
        title: title,
        content: content
    };

    db.Article.create(newArticle)
        .then(article => {
            res.send(article)
        }).catch(err => {
        console.log(err);
        res.status(500).send({error: "Error while adding new article"});
    })
};

exports.updateArticle = (req, res) => {
    let title = req.body.title;
    let content = req.body.content;

    db.Article.create({
        title: title,
        content: content
    }).then(article => {
        res.send({article: article})
    }).catch(err => {
        console.log(err);
    })
};


exports.deleteArticle = (req, res) => {
    let articleId = req.params.articleId;

    db.Article.destroy({
        where: {
            id: articleId,
            some: 1
        }
    })
        .then(isDeleted => {
            console.log("Is deleted" + isDeleted);
            res.send({deleted: isDeleted})
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: 'Error while deleting article: ' + err})
        })
};

