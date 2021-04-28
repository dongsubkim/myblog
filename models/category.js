const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subcategories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    // posts : [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Post'
    //     }
    // ]
})

// PostSchema.post('findOneAndDelete', async function (doc) {
//     if (doc) {
//         await Comment.deleteMany({
//             _id: {
//                 $in: doc.comments
//             }
//         })
//     }
// })

module.exports = mongoose.model("Category", CategorySchema);