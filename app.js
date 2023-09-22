const express = require('express')
require('dotenv').config()
const connectDB = require('./db/connect')
const NotFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authentication = require('./middleware/authentication')

// Import routers
const { agentRouter, authRouter, favoriteRouter, categoryRouter,
    propertyRouter, searchRouter, saveSearchRouter } = require('./Routes/router')


// Initialize the express 
const app = express();


// middleware
app.use(express.json())
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/properties', authentication, propertyRouter)
app.use('/api/v1/search', searchRouter)
app.use('/api/v1/category', authentication, categoryRouter)
app.use('/api/v1/agent', authentication, agentRouter)
app.use('/api/v1/favorites', authentication, favoriteRouter)
app.use('/api/v1/saved-searches', authentication, saveSearchRouter)

app.use(NotFoundMiddleware)
app.use(errorHandlerMiddleware)


const PORT = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, console.log(`Server is listening on: http://localhost:${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()