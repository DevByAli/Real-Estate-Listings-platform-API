const express = require('express')
const search = require('../Controllers/search')

const router = express.Router()

router.route('/').get(search)


module.exports = router