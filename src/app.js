const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())



const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/users',userRoutes)
module.exports = app