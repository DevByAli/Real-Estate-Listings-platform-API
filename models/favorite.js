const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
    _id: {
        type: ObjectId,
        required: [true, 'Please provide the user id'],
        ref: 'users'
    },
    propertyIdList: {
        type: [{
            _id: {
                type: ObjectId,
                required: [true, 'Please provide the property id']
            }
        }],
    }
});

module.exports = mongoose.model('favorite-properties', favoriteSchema);
