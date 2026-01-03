const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cart: [],
    isadmin: Boolean,
    orders: [],
    contact: Number,
    picture: String
})

module.exports = mongoose.model('user', userSchema)