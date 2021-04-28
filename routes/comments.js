const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const comments = require('../controllers/comments');
const { validateComment, isCommentAuthor } = require('../middleware');

router.post('/', catchAsync(comments.createComment));

router.route('/:commentId')
    .put(
        isCommentAuthor,
        // validateComment,
        catchAsync(comments.updateComment)
    )
    .delete(
        isCommentAuthor,
        catchAsync(comments.deleteComment)
    );

module.exports = router;

