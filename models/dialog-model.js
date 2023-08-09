const {Schema, model} = require('mongoose')



const dialogSchema = Schema({
    participants: {
        type: Array,
        default: []
    },
    messages: {
        type: Array,
        default: []
    }
}, {versionKey:  false})

const Dialog = model('dialog', dialogSchema)
module.exports = Dialog