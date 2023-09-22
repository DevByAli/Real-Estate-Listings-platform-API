const Property = require('../models/property')
const { StatusCodes } = require("http-status-codes");

const search = async (req, res, next) => {
    const { title, minPrice, maxPrice, location, type, sort, fields } = req.query
    const queryObject = {}
    if (title) {
        queryObject.title = { $regex: title, $options: 'i' };
    }
    if (location) {
        queryObject.location = { $regex: location, $options: 'i' };
    }
    if (type) {
        queryObject.type = { $regex: type, $options: 'i' };
    }
    if (minPrice && maxPrice) {
        queryObject.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
    }

    try {
        let result = Property.find(queryObject)
        if (sort) {
            const sortList = sort.split(',').join(' ')
            result = result.sort(sortList)
        }
        if (fields) {
            const fieldList = fields.split(',').join(' ')
            result = result.select(fieldList)
        }

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        result = result.skip(skip).limit(limit)

        const properties = await result
        res.status(StatusCodes.OK).json({ properties: { properties }, nbHits: properties.length })
    } catch (error) {
        return next(error)
    }
}

module.exports = search