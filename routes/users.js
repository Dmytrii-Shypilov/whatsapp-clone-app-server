const express = require('express')
const usersAPI = require('../controllers/userControllers')


const router = express.Router()

router.post('/signup', usersAPI.signUp)
router.post('/login', usersAPI.logIn)
router.get('/current', usersAPI.getCurrent)
router.get('/all', usersAPI.getAllUsers)
router.post('/logout', usersAPI.logOut)


module.exports = router