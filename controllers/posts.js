const { Post, Category } = require('../models/post');

module.exports.index = async (req, res) => {
    const { category: queryCategory } = req.query;
    let filter = {};
    if (queryCategory) {
        filter = { category: queryCategory }
    }
    const posts = await Post.find(filter);
    req.session.queryCategory = queryCategory;
    res.render('posts/index', { posts, Category });

}

module.exports.showPost = async (req, res) => {
    const { queryCategory } = req.session;
    let originalUrl = '/posts'
    if (queryCategory) {
        originalUrl = `${originalUrl}?category=${queryCategory}`
    }
    const post = await Post.findById(req.params.id).populate('comments');
    if (!post) {
        req.flash('error', 'Cannot find the post');
        res.redirect('/posts');
    }
    res.render('posts/show', { post, originalUrl })
}

module.exports.renderNewForm = (req, res) => {
    res.render('posts/new')
}

module.exports.renderEditForm = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        req.flash('error', 'Cannot find the post');
        res.redirect('/posts');
    }
    res.render('posts/edit', { post });
}

module.exports.createPost = async (req, res) => {
    const post = new Post(req.body.post);
    if (req.files) {
        post.images = req.files.map(f => ({ url: f.path, filename: f.filename, originalname: f.originalname }));
    }
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Successfully made a new post!');
    res.redirect(`/posts/${post._id}`);
}

module.exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    await post.save();
    req.flash('success', 'Successfully updated Post!')
    res.redirect(`/posts/${post._id}`)
}

module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Post')
    res.redirect('/posts');
}
