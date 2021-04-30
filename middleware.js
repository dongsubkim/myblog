const { postSchema, commentSchema } = require('./schemas.js');
const ExpressError = require('./utils/expressError');
const Post = require('./models/post');
const Comment = require('./models/comment');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(req.params.id);
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission to do that!');
        // return res.redirect(`/posts/${id}`);
        return res.redirect('back');
    }
    next();
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    const candidatePassword = req.body.comment.password;
    comment.comparePassword(candidatePassword, function (err, isMatch) {
        if (err) throw new ExpressError(err, 400)
        if (isMatch) {
            next();
        }
        else {
            req.flash('error', 'Password Not Matched!');
            return res.redirect('back');
        }
    });
}

