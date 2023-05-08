const mongoose = require('mongoose');

const AllProductsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    descriptionUz: {
        type: String,
        required: true
    },
    descriptionRu: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    price: {
        type: String,
        // required: true
    },
    types: {
        type: String,
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
    address: {
        type: String,
        required: true 
    },
    time : { 
        type : Date, 
        default: Date.now 
    },
    views: {
        type: Number
    }
})

module.exports = mongoose.model('AllProducts', AllProductsSchema);