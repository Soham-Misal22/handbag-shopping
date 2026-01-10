const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
    ,
    isadmin: Boolean,
    orders: [],
    contact: Number,
    picture: String
})

module.exports = mongoose.model('user', userSchema)