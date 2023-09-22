const Property = require('../models/property')
const Image = require('../models/image')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors/')

const getAllProperties = async (req, res) => {
    // const properties = await Property.find({})
    const { location, minPrice, maxPrice, type } = req.query
    const queryObject = {}
    if (location) {
        queryObject.location = { $regex: location, $options: 'i' }
    }
    if (minPrice && maxPrice) {
        queryObject.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
    }
    if (type) {
        queryObject.type = { $regex: type, $options: 'i' }
    }

    const properties = await Property.find(queryObject)
    res.status(StatusCodes.OK).json({ properties, nbHits: properties.length })
}

const postProperty = async (req, res, next) => {
    try {
        const property = await Property.create(req.body)
    } catch (error) {
        return next(error)
    }
    res.status(StatusCodes.CREATED).json({ msg: 'New Property is posted!' })
}

const getProperty = async (req, res, next) => {
    const propertyId = req.params.id
    if (!propertyId) {
        return next(new BadRequestError("Please provide the ID"))
    }
    try {
        var property = await Property.find({ _id: propertyId })
        if (property.length === 0) {
            return next(new NotFoundError(`Property of id: ${propertyId} not found`))
        }
    } catch (error) {
        return next(error)
    }
    res.status(StatusCodes.OK).json({ property })
}

const updateProperty = async (req, res, next) => {
    const propertyId = req.params.id
    if (!propertyId) {
        return next(new BadRequestError("Please provide the ID"))
    }

    try {
        const property = await Property.updateOne({ _id: propertyId }, req.body, { new: true, runValidators: true })
        if (property.matchedCount === 0) {
            return next(new NotFoundError(`Property of id: ${propertyId} not found`))
        }
    } catch (error) {
        return next(error)
    }
    res.status(StatusCodes.OK).json({ msg: `Property with id: ${propertyId} is updated` })
}

const deleteProperty = async (req, res, next) => {
    const propertyId = req.params.id
    if (!propertyId) {
        return next(new BadRequestError("Please provide the ID"))
    }
    try {
        const property = await Property.deleteOne({ _id: propertyId })
        if (property.deletedCount === 0) {
            return next(new NotFoundError(`Property of id: ${propertyId} not found`))
        }
    } catch (error) {
        return next(error)
    }
    res.status(StatusCodes.NO_CONTENT).send()
}

// Upload Image
var fs = require('fs');
var path = require('path');

const uploadImage = async (req, res, next) => {

    const filePath = req.body.filePath
    const propertyId = req.params.propertyID

    if (!filePath) {
        return next(new NotFoundError('No file is selected!'))
    }
    try {
        var newImage = {
            data: fs.readFileSync(filePath),
            contentType: 'image/png'
        }
    } catch (error) {
        return next(error)
    }

    try {
        const isPropertyExist = await Property.findOne({ _id: propertyId })
        const isImageExist = await Image.findOne({ _id: propertyId })

        // If the image against the property is already exist then just add one more image
        if (isPropertyExist && isImageExist) {
            const upload = await Image.updateOne({ _id: propertyId }, {
                $push: {
                    images: {
                        imageData: newImage
                    }
                }
            })
            // If the image against the property is not exist then add new entity in the table
        } else if (isPropertyExist && !isImageExist) {
            const msg = await Image.create({
                _id: propertyId,
                images: [{
                    imageData: newImage
                }]
            })
        } else {
            return next(new BadRequestError(`Property of id :${propertyId} not found`))
        }
    } catch (error) {
        return next(new BadRequestError("Please provide the valid property ID"))
    }
    res.status(StatusCodes.CREATED).json({ msg: `Image of property for id: ${propertyId} is uploaded` })
}

const deleteImage = async (req, res, next) => {
    const propertyId = req.params.propertyID
    const imageId = req.params.imageID

    if (!propertyId || !imageId) {
        return next(new BadRequestError('Please provide both property id and image id'))
    }

    try {
        const deleteImage = await Image.updateOne(
            { _id: propertyId },
            { $pull: { images: { _id: imageId } } }
        )
        if (deleteImage.matchedCount == 0) {
            return next(new NotFoundError(`Property of id: ${propertyId} not found`))
        }
        if (deleteImage.modifiedCount == 0) {
            return next(new NotFoundError(`Image of id: ${imageId} not found`))
        }
    } catch (error) {
        return next(new BadRequestError("Please provide valid id's"))
    }
    res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = {
    getAllProperties,
    getProperty,
    postProperty,
    updateProperty,
    deleteProperty,
    uploadImage,
    deleteImage
}