const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const marked = require('marked');
const sanitizeHtml = require('sanitize-html');
const striptags = require('striptags');
const Comment = require('./comment');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

// ImageSchema.virtual('thumbnail').get(function () {
//     return this.url.replace('/upload', '/upload/w_250')
// })

ImageSchema.virtual('square').get(function () {
    return this.url.replace('/upload', '/upload/w_300,ar_1:1,c_fill,g_auto,e_art:hokusai')
})

const PostSchema = new Schema({
    content: String,
    title: String,
    category: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    images: [ImageSchema],
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
    let stripped = striptags(marked(this.content));
    if (this.content.length > 200) {
        stripped = stripped.slice(0, 200).concat("...")
    }
    return stripped
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

PostSchema.pre('save', async function (next) {
    if (this.images.length > 0) {
        for (let i = 1; i <= this.images.length; i++) {
            this.content = this.content.replace(`![image${i}](http://)`, `![image${i}](${this.images[i - 1].url})`)
        }
    }
    next();
})

module.exports = mongoose.model("Post", PostSchema);