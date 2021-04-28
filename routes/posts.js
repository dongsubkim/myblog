const express = require('express');
const router = express.Router();
const { validatePost } = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const posts = require('../controllers/posts');

router.route('/')
    .get(catchAsync(posts.index))
    .post(
        // isLoggedIn,
        // validatePost,
        catchAsync(posts.createPost));

router.get('/new', posts.renderNewForm);

router.route('/:id')
    .get(catchAsync(posts.showPost))
    .put(
        // isLoggedIn,
        // isAuthor,
        // upload.array('image'),
        validatePost,
        catchAsync(posts.updatePost)
    )
    .delete(
        // isLoggedIn,
        // isAuthor,
        catchAsync(posts.deletePost)
    );


router.get('/:id/edit', 
    // isLoggedIn,
    // isAuthor,
    catchAsync(posts.renderEditForm));

module.exports = router;