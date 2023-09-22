const express = require('express')
const router = express.Router()

const { getAllAgents, addNewAgent, updateAgent, deleteAgent } = require('../Controllers/agent')

router.route('/').get(getAllAgents).post(addNewAgent)
router.route('/:id').put(updateAgent).delete(deleteAgent)

module.exports = router