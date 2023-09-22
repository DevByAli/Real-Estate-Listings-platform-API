const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

const AgentSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 5,
        maxlength: 15
    },
    contact: {
        type: Number,
        required: [true, "Please provide contact number"]
    },
    affiliatedAgency: {
        type: String,
        required: [true, "Please provide the Agency affiliation."],
        enum: {
            values: ['Brick Lane Realty', 'Lark Homes', 'Jasper Realty', 'Divine Nooks'],
            message: 'Invalid Agency',
        },
    },
},
    {
        timestamps: true
    })

AgentSchema.pre('save', function (next) {
    if (this.name && this.affiliatedAgency) {
        this.name = this.name.trim()
        this.affiliatedAgency = this.affiliatedAgency.trim()
    }
    next()
})


module.exports = mongoose.model("Agent", AgentSchema)