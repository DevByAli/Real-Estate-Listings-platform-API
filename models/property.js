const { Decimal128, ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide the title'],
        minlength: 5,
        maxlength: 25,
    },
    description: {
        type: String,
        required: [true, 'Please provide the description'],
        minlength: 15,
        maxlength: 150,
    },
    location: {
        type: String,
        required: [true, 'Please select the location'],
        enum: {
            values: ['London', 'Manchester', 'Bangor', 'Oxford', 'Bristol', 'Sheffield', 'Cambridge'],
            message: '{VALUE} is not supported',
        },
    },
    price: {
        type: Decimal128,
        required: [true, 'Please provide the price'],
        validate: {
            validator: function (value) {
                return value > 10000;
            },
            message: 'Price must be greater than 10000',
        },
    },
    type: {
        type: String,
        required: [true, 'Please select the property type'],
        enum: {
            values: ['Sale', 'Rent'],
            message: '{VALUE} is not supported',
        }
    }
});

PropertySchema.pre('save', function (next) {
    if (this.title && this.description && this.location && this.type) {
        this.title = this.title.trim()
        this.description = this.description.trim()
        this.location = this.location.trim()
        this.type = this.type.trim()
    }
    next()
})

module.exports = mongoose.model('Property', PropertySchema);
