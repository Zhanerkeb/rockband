let posts = [
    {
        id: 1,
        title: "Post title 1",
        content: "Post content 1"
    },
    {
        id: 2,
        title: "Post title 2",
        content: "Post content 2"
    },
    {
        id: 3,
        title: "Post title 3",
        content: "Post content 3"
    }
];


module.exports = function addPost(title, content) {
    let lastId = posts[posts.length - 1].id + 1

    let newPost = {
        id: lastId,
        title,
        content
    };

    posts.push(newPost)
}


let users = [
    {
        username: "sfbsf",
        password: "ajhb shb"
    },

    {
        username: "qwe",
        password: "asd"
    },
];


module.exports.getPostByID = (id) => {
    // for(post in posts) {
    //     if(post.id == id) return post
    // }
    console.log(id)
    return posts.filter((post) => {return post.id == id})

};

module.exports.userList = users;
module.exports.posts = posts;




