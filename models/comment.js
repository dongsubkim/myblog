const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const CommentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})

CommentSchema.pre('save', function(next) {
    const comment = this;

    // only hash the password if it has been modified (or is new)
    if (!comment.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(comment.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            comment.password = hash;
            next();
        });
    });
});

CommentSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        else cb(null, isMatch);
    });
};

CommentSchema.virtual('convertedComment').get(function () {
    return this.comment.replace(/\r\n/g, '<br>')
})

module.exports = mongoose.model("Comment", CommentSchema);