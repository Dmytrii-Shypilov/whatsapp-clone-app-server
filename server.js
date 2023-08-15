const mongoose = require('mongoose')
const server = require('./app')

const {DB_HOST, PORT=4000} = process.env

console.log(PORT)
mongoose.connect(DB_HOST)
    .then(()=> server.listen(PORT, ()=> console.log("Database connection successful", PORT)))
    .catch((err)=> {
        console.log(err.message)
        process.exit(1)
    })