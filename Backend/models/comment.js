const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
    content: { type: String, required: true},
    author:{ type: mongoose.SchemaTypes.ObjectId, ref: "user"},
    blog: { type: mongoose.SchemaTypes.ObjectId, ref: "blog"}
})

module.exports = mongoose.model('comment', commentSchema, 'comments');