const mongoose = require('mongoose');
const slugify=require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        lowercase: true
    }
})

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;