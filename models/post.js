const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required: true },
    content: {type: String, required: true},
    date: {type: Date, required: true},
    liked_by: [{type: Schema.Types.Mixed, required: true}],
    published: {type: Boolean, required: true},
    user: {type: Schema.Types.Mixed, required: true},
    comments: [{type: Schema.Types.Mixed, required: true}],
});

module.exports = mongoose.model("Post", PostSchema);