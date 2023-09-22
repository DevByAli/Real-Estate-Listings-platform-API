const express = require('express')
const router = express.Router()

const {getAllCategories, addNewCategory, updateCategory, deleteCategory} = require('../Controllers/category')


router.route('/').get(getAllCategories).post(addNewCategory)
router.route('/:id').put(updateCategory).delete(deleteCategory)

module.exports = router