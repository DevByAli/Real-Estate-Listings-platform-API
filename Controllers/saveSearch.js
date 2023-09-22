const SaveSearches = require('../models/save-search')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')


const getUserId = (req) => {
    const token = req.headers.authorization.split(' ')[1]
    const payload = jwt.verify(token, process.env.SECRET_KEY)
    return payload.userId
}

const getAllSavedSearches = async (req, res, next) => {
    const userId = getUserId(req)
    try {
        const savedSearches = await SaveSearches.find({ _id: userId })
        const searchList = ([...savedSearches])[0].savedSearches
        res.status(StatusCodes.OK).json({ userId: userId, savedSearches: searchList, nbHits: searchList.length })
    } catch (error) {
        return next(error)
    }
}

const saveSearch = async (req, res, next) => {
    const userId = getUserId(req)
    const criteria = req.body.criteria
    
    const validationObject = {}
    if (criteria.title) validationObject.title = criteria.title
    if (criteria.location) validationObject.location = criteria.location
    if (criteria.type) validationObject.type = criteria.type
    if (criteria.minPrice) validationObject.minPrice = criteria.minPrice
    if (criteria.maxPrice) validationObject.maxPrice = criteria.maxPrice

    if (!criteria || (criteria && Object.keys(validationObject).length === 0)) {
        return next(new BadRequestError("Please provide the criteria"))
    }

    try {
        const isUserExist = await SaveSearches.findOne({ _id: userId })
        if (isUserExist) {
            await SaveSearches.updateOne({ _id: userId }, {
                $push: {
                    savedSearches: { criteria: criteria }
                }
            }, { new: true, runValidators: true })
        } else {
            await SaveSearches.create({
                _id: userId,
                savedSearches: [{ criteria: criteria }]
            })
        }
    } catch (error) {
        return next(error)
    }
    res.status(StatusCodes.CREATED).send("Search Saved!")
}

const deleteSavedSearch = async (req, res, next) => {
    const userId = getUserId(req)
    const criteriaId = req.body.criteriaId

    if (!criteriaId) {
        return next(new BadRequestError("Please provide the criteria id"))
    }
    try {
        const deleteSavedSearch = await SaveSearches.updateOne({ _id: userId }, {
            $pull: { savedSearches: { _id: criteriaId } }
        })
        if (deleteSavedSearch.matchedCount == 0) {
            return next(new NotFoundError(`This user has not saved searches`))
        }
        if (deleteSavedSearch.modifiedCount == 0) {
            return next(new NotFoundError(`Saved search of id: ${criteriaId} not found`))
        }
    } catch (error) {
        return next(error)
    }
    res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = {
    getAllSavedSearches,
    saveSearch,
    deleteSavedSearch
}