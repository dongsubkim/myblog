const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const categories = require('../controllers/categories');
// const { validateComment, isCommentAuthor } = require('../middleware');

router.route('/')
    .get(catchAsync(categories.index))

module.exports = router;

