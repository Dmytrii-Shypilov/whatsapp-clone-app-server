const express = require('express')
const usersAPI = require('../controllers/userControllers')
const authorizationAPI = require('../middlewares/authorization')


const router = express.Router()

router.post('/signup', usersAPI.signUp)
router.post('/login', usersAPI.logIn)
router.get('/current',authorizationAPI.authorizeHttp, usersAPI.getCurrent)
router.get('/all', usersAPI.getAllUsers)
router.post('/logout', usersAPI.logOut)


module.exports = router