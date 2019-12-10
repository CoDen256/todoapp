const {Schema, model} = require('mongoose')
const userSchema = require('./User').Schema

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
    },

    type: {
        type: Number,
        default:0
    }

})

module.exports = model('Task', schema)