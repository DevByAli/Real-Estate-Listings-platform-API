const Agent = require('../models/Agent')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')


const getAllAgents = async (req, res, next) => {
    const agents = await Agent.find({})
    res.status(StatusCodes.OK).json({ Agents: { agents }, nbHits: agents.length })
}

const addNewAgent = async (req, res, next) => {
    try {
        await Agent.create(req.body)
    } catch (error) {
        return next(error)
    }

    res.status(StatusCodes.CREATED).send("New Agent added!")
}

const updateAgent = async (req, res, next) => {
    const agentId = req.params.id
    if (!agentId) {
        return next(new BadRequestError("Please provide the agent id"))
    }

    try {
        const updateResult = await Agent.updateOne({ _id: agentId }, req.body, { new: true, runValidators: true })
        if (updateResult.matchedCount === 0) {
            return next(new NotFoundError(`Agent of id: ${propertyId} not found`))
        }
    } catch (error) {
        return next(error)
        console.log(req.body)
    }
    res.status(StatusCodes.OK).send(`Agent of id: ${agentId} is updated`)
}

const deleteAgent = async (req, res, next) => {
    const agentId = req.params.id
    if (!agentId) {
        return next(new BadRequestError("Please provide the agent id"))
    }

    try {
        const deleteAgent = await Agent.deleteOne({ _id: agentId })
        if (deleteAgent.deletedCount == 0) {
            return next(new NotFoundError(`Category of id: ${categoryId} not found`))
        }
    } catch (error) {
        return next(new BadRequestError("Please provide valid agent id"))
    }
    res.status(StatusCodes.NO_CONTENT).send()
}


module.exports = {
    getAllAgents,
    addNewAgent,
    updateAgent,
    deleteAgent
}