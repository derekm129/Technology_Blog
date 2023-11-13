const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// User
User.hasMany(Post, {
    foreignKey: 'post_id',
});

User.hasMany(Comment, {
    foreignKey: 'comment_id',
} );

// Post
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

Post.hasMany(Comment, {
    foreignKey: 'comment_id',
});

// Comment
Comment.belongsTo(User, {
    foreignKey: 'user_id',
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id',
});