const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide the property ID']
    },
    images: [{
        imageData: {
            data: Buffer,
            contentType: String,
        }
    }],
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;