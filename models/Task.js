const {Schema, model} = require('mongoose')
const userSchema = require('./User').Schema

const schema = new Schema({
    title: {
        type: String,
        required:true,
    },
    user: {
        type: userSchema,
        required:true
    },

    type: {
        type: Number,
        default:0
    },

    priority: {
        type: String,
        default: "secondary"
    },
})

module.exports = model('Task', schema)