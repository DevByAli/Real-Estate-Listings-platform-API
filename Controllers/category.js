const Category = require('../models/category')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllCategories = async (req, res, next) => {
    const categories = await Category.find({})
    res.status(StatusCodes.OK).json({ Categories: { categories }, nbHits: categories.length })
}

const addNewCategory = async (req, res, next) => {
    try {
        await Category.create(req.body)
    } catch (error) {
        return next(error)
    }
    res.status(StatusCodes.CREATED).send("New category added!")
}

const updateCategory = async (req, res, next) => {
    const categoryId = req.params.id
    if (!categoryId) {
        return next(new BadRequestError("Please provide the category id"))
    }

    try {
        const updateResult = await Category.updateOne({ _id: categoryId }, req.body, { new: true, runValidators: true })
        if (updateResult.matchedCount === 0) {
            return next(new NotFoundError(`Property of id: ${propertyId} not found`))
        }
    } catch (error) {
        return next(error)
    }
    res.status(StatusCodes.OK).send(`Category of id: ${categoryId} is updated`)
}

const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id
    if (!categoryId) {
        return next(new BadRequestError("Please provide the category id"))
    }

    try {
        const deleteCategory = await Category.deleteOne({ _id: categoryId })
        if (deleteCategory.deletedCount == 0) {
            return next(new NotFoundError(`Category of id: ${categoryId} not found`))
        }
    } catch (error) {
        return next(new BadRequestError("Please provide the valid category id"))
    }
    res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = {
    getAllCategories,
    updateCategory,
    deleteCategory,
    addNewCategory
}