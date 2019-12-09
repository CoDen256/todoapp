const {Schema, model} = require('mongoose')
const userSchema = require('../models/User').Schema

const schema = new Schema({
    title: {
        type: String,
        required:true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: userSchema,
        required:true
    }

})

module.exports = model('Todo', schema)