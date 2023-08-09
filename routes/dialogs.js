const express = require('express')
const dialogsAPI = require('../controllers/dialogControllers')
const authorizationAPI = require('../middlewares/authorization')

const router = express.Router()

router.get('/all', authorizationAPI.authorizeHttp, dialogsAPI.getAllDialogs)


module.exports = router