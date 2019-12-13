let mongoose = require('mongoose')

var BookSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: String,
    isbn: {
        type: String,
        unique: true,
        required: true
    },
    publishedOn: Number,
    numberOfPages: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Book', BookSchema)
