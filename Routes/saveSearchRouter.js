const express = require('express')
const router = express.Router()

const { getAllSavedSearches, saveSearch, deleteSavedSearch } = require('../Controllers/saveSearch')

router.route('/').get(getAllSavedSearches).post(saveSearch).delete(deleteSavedSearch)

module.exports = router