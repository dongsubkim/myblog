const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const marked = require('marked');
const striptags = require('striptags');
const Comment = require('./comment');
const hljs = require('highlight.js');
const { cloudinary } = require('../cloudinary');
const Category = {};

marked.setOptions({
    highlight: function (code, lang, callback) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    breaks: true
});

const ImageSchema = new Schema({
    url: String,
    filename: String,
    originalname: String,
});

// ImageSchema.virtual('thumbnail').get(function () {
//     return this.url.replace('/upload', '/upload/w_250')
// })

ImageSchema.virtual('square').get(function () {
    return this.url.replace('/upload', '/upload/w_180,ar_1:1,c_fill,g_auto,e_art:hokusai')
})

const PostSchema = new Schema({
    content: String,
    title: String,
    category: [
        {
            type: String
        }
    ],
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
}, {
    timestamps : true
})

PostSchema.virtual('html').get(function () {
    return marked(this.content);
})

PostSchema.virtual('plain').get(function () {
    let stripped = striptags(marked(this.content));
    if (stripped.length > 200) {
        return stripped.slice(0, 200).concat("...")
    }
    return stripped
})

PostSchema.virtual('lastModified').get(function() {
    let o = new Intl.DateTimeFormat("en" , {
        timeStyle: "medium",
        dateStyle: "short"
    });
    if (this.updatedAt.toString() === this.createdAt.toString()) {
        return "Created: " + o.format(this.updatedAt)
    } else {
        return "Last Modified: " + o.format(this.updatedAt)
    }
})

PostSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
        for (let image of doc.images) {
            await cloudinary.uploader.destroy(image.filename);
        }
    }
    updateCategory();
})

PostSchema.pre('save', async function (next) {
    if (this.images.length > 0) {
        for (let i = 0; i < this.images.length; i++) {
            let imageName = this.images[i].originalname;
            let res = `!\\[${imageName}\\]\\(http:\\/\\/\\)`.replace(/\./g, '\\.')
            let re = new RegExp(res, 'g')
            this.content = this.content.replace(re, `![${imageName}](${this.images[i].url})`);
        }
    }
    next();
})

PostSchema.post('save', async function (doc) {
    updateCategory();
})

const PostModel = mongoose.model("Post", PostSchema);

function updateCategory() {
    for (var variableKey in Category) {
        if (Category.hasOwnProperty(variableKey)) {
            delete Category[variableKey];
        }
    }
    PostModel.find({}, 'category', function (err, docs) {
        if (docs) {
            for (let category in docs) {
                const cs = docs[category].category
                for (let key in cs) {
                    let value = cs[key];
                    if (value in Category) {
                        Category[value] += 1
                    } else {
                        Category[value] = 1
                    }
                }
            }
        }
    });
}
updateCategory();
module.exports.Post = PostModel;
module.exports.Category = Category;
