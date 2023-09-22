const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide the name"],
        minlength: 5,
        maxlength: 15
    },
    description: {
        type: String,
        required: [true, "Please provide the description"],
        minlength: 50,
        maxlength: 150
    }
})

CategorySchema.pre('save', function (next) {
    if (this.name && this.description) {
        this.name = this.name.trim()
        this.description = this.description.trim()
    }
    next()
})

module.exports = mongoose.model("Categories", CategorySchema)