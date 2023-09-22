require('dotenv').config()
const Property = require('../models/property')
const Favorite = require('../models/favorite')
const jwt = require('jsonwebtoken')
const { NotFoundError, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes')


const getUserId = (req) => {
    const token = req.headers.authorization.split(' ')[1]
    const payload = jwt.verify(token, process.env.SECRET_KEY)
    return payload.userId
}

const getFavoriteProperties = async (req, res, next) => {
    const userId = getUserId(req)

    try {
        let favoriteProperties = await Favorite.find({ _id: userId })
        if (favoriteProperties.length != 0)
            favoriteProperties = favoriteProperties[0].propertyIdList

        const properties = []
        for (const obj of favoriteProperties) {
            const property = await Property.find({ _id: obj.propertyId })
            properties.push(property[0])
        }
        res.status(StatusCodes.OK).json({ properties, nbHits: favoriteProperties.length })
    } catch (error) {
        return next(error)
    }
}

const addFavoriteProperty = async (req, res, next) => {
    const userId = getUserId(req);
    const favPropId = req.body.propertyId;

    if (!favPropId) {
        return next(new BadRequestError('Please provide the Property id'));
    }

    try {
        const isPropertyExist = await Property.findOne({ _id: favPropId });
        const isFavListExist = await Favorite.findOne({ _id: userId });
        const isFavPropExists = isFavListExist
            ? isFavListExist.propertyIdList.some(item => item._id.equals(favPropId))
            : false;

        console.log(`UserID: ${userId}`)
        console.log(`favPropId: ${favPropId}`)
        console.log(`isFavListExist: ${isFavListExist}`)
        console.log(`isFavPropExits: ${isFavPropExists}`)

        if (!isPropertyExist) {
            return next(new NotFoundError(`Property of id: ${favPropId} not exist`));
        } else if (isFavPropExists) {
            return next(new BadRequestError(`This property is already a favorite`));
        }

        if (isFavListExist) {
            await Favorite.updateOne(
                { _id: userId },
                {
                    $push: {
                        propertyIdList: { _id: favPropId }
                    }
                },
                { new: true, runValidators: true }
            );
        } else {
            await Favorite.create({ _id: userId, propertyIdList: [{ _id: favPropId }] })
        }
    } catch (error) {
        return next(error);
    }
    res.status(StatusCodes.CREATED).send("Favorite property added!");
};

const deleteFavoriteProperty = async (req, res, next) => {
    const userId = getUserId(req)
    const favPropId = req.body.propertyId

    if (!favPropId) {
        return next(new BadRequestError('Please provide the Property id'))
    }
    try {
        const deleteFavProp = await Favorite.updateOne({ _id: userId }, {
            $pull: {
                propertyIdList: { _id: favPropId }
            }
        })
        if (deleteFavProp.matchedCount === 0) {
            return next(new NotFoundError(`This user has not favorite property`))
        }
        if (deleteFavProp.modifiedCount === 0) {
            return next(new NotFoundError(`Favorite Property of id: ${favPropId} not found`))
        }
    } catch (error) {
        return next(error)
    }
    res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = {
    getFavoriteProperties,
    addFavoriteProperty,
    deleteFavoriteProperty
}