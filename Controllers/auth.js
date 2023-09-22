const User = require('../models/user')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const { StatusCodes } = require('http-status-codes')

const register = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new BadRequestError('Invalid Request'))
    }
    if (authHeader != 'Bearer null') {
        return next(new BadRequestError('Invalid Request'))
    }
    const user = await User.create(req.body)
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: user.getName(), token })

}

const login = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new BadRequestError("Please provide email"))
    }
    const user = await User.findOne({ email })
    if (!user) {
        return next(new UnauthenticatedError('Invalid Credentials'))
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        return next(new UnauthenticatedError('Invalid Credentials'))
    }

    const token = user.createJWT()
    res.status(StatusCodes.ACCEPTED).json({ user: { user: user.getName() }, token })
}

const logout = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader === 'Bearer null') {
        return next(new BadRequestError('User is not login yet'))
    }

    try {
        res.status(StatusCodes.OK).json({ message: "User Logout", token: 'null' })
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    register,
    login,
    logout
}