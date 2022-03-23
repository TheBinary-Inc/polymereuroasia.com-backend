const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 5,
        maxLenth: 1024
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLenth: 1024
    }
})

module.exports = mongoose.model("Admin", AdminSchema);