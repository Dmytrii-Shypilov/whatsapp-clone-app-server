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
        type: [{
            from:{
                type: String
            },
            messageContent: {
                type: [{
                    message: {
                        type: String
                    },
                    time: {
                        type: String
                    },
                    isRead: {
                        type: Boolean
                    }

                }]
            }
        }],
        default: []
    }
}, {versionKey:  false})

const Dialog = model('dialog', dialogSchema)
module.exports = Dialog