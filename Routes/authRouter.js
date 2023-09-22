const express = require('express')
const { register, login, logout } = require('../Controllers/auth')


const router = express.Router()



router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)

module.exports = router