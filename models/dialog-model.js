const {Schema, model} = require('mongoose')


const dialogSchema = Schema({
    participants: {
        type: [{
            name: {
                type: String
            },
            id: {
                type: String,
            },
            accepted: {
                type: Boolean
            }
        }],
        default: []
    },
    messages: {
        type: [],
        default: []
    }
}, {versionKey:  false})

const Dialog = model('dialog', dialogSchema)
module.exports = Dialog