const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    parent: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    ]
})

module.exports = mongoose.model("Category", CategorySchema);