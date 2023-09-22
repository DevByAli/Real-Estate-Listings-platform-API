const { ObjectId, Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const { BadRequestError } = require('../errors')

const SaveSearchSchema = mongoose.Schema({
    _id: {
        type: ObjectId,
        required: [true, 'Please provide the user id'],
        ref: 'users'
    },
    savedSearches: [{
        criteria: {
            type: Object,
            title: {
                type: String
            },
            location: {
                type: String,
                enum: {
                    values: ['London', 'Manchester', 'Bangor', 'Oxford', 'Bristol', 'Sheffield', 'Cambridge'],
                    message: '{VALUE} is not supported',
                },
            },
            minPrice: {
                type: Decimal128,
                validate: [
                    {
                        validator: function (value) {
                            return !this.criteria.maxPrice || (value < this.criteria.maxPrice && value >= 0);
                        },
                        message: "minPrice must be smaller than maxPrice and greater than or equal to '0'",
                    },
                    {
                        validator: function (value) {
                            return !this.criteria.maxPrice || value !== undefined;
                        },
                        message: "minPrice requires maxPrice to be provided",
                    }
                ],
            },
            maxPrice: {
                type: Decimal128,
                validate: [
                    {
                        validator: function (value) {
                            return !this.criteria.minPrice || value > this.criteria.minPrice;
                        },
                        message: 'maxPrice must be greater than minPrice',
                    },
                    {
                        validator: function (value) {
                            return !this.criteria.minPrice || value !== undefined;
                        },
                        message: "maxPrice requires minPrice to be provided",
                    }
                ],
            },
            type: {
                type: String,
                enum: {
                    values: ['Sale', 'Rent'],
                    message: '{VALUE} is not supported',
                }
            }
        }
    }]
});


module.exports = mongoose.model('Saved-Searches', SaveSearchSchema);