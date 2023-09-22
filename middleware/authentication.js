const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors')


const auth = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthenticatedError('Please login the account'))
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        req.user = { userId: payload.userId, name: payload.name };
        next();
    } catch (error) {
        return next(new UnauthenticatedError('Please login the account'))
    }
}

module.exports = auth;