const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = module.exports = mongoose.model('Article', articleSchema);