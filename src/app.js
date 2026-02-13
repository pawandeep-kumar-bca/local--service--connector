const express = require('express')


const app = express()
app.use(express.json())


app.use()

const authRoutes = require('./routes/auth.routes')

app.use('/api/v1/auth',authRoutes)
module.exports = app