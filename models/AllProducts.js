const mongoose = require('mongoose');

const AllProductsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ratings: {
        type: Number,
        default: 0
    },
    author: {
        type: String,
        required: true
    },
    authorPhoneNumber: {
        type: String,
        required: true
    },
    productCategory: {
        type: String,
        required: true,
        default: "smartphones"
    },
    sale: {
        type: String,
        default: 0,
        required: true
    },
    address: {
        type: String,
        required: true 
    },
    time : { 
        type : Date, 
        default: Date.now 
    }
})

module.exports = mongoose.model('AllProducts', AllProductsSchema);