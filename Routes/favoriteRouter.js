const express = require('express')
const router = express.Router()

const { getFavoriteProperties, addFavoriteProperty, deleteFavoriteProperty } = require('../Controllers/favorite')

router.route('/').get(getFavoriteProperties).post(addFavoriteProperty).delete(deleteFavoriteProperty)

module.exports = router