const { StatusCodes } = require('http-status-codes')

const notFound = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).send('Route not exits')
}

module.exports = notFound