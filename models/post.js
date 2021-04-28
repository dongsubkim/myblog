const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const marked = require('marked');
const sanitizeHtml = require('sanitize-html');
const striptags = require('striptags');
const Comment = require('./comment');

const PostSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

PostSchema.virtual('html').get(function () {
    return marked(this.content);
})

PostSchema.virtual('plain').get(function () {
    return striptags(marked(this.content));
})

PostSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model("Post", PostSchema);