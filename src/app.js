const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())



const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const adminRoutes = require('./routes/admin.routes')
const providerRoutes = require('./routes/provider.routes')
const bookingRoutes = require('./routes/booking.routes')
const reviewRoutes = require('./routes/review.routes')
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/categories',adminRoutes)
app.use('/api/v1/providers',providerRoutes)
app.use('/api/v1/bookings',bookingRoutes)
app.use('/api/v1/reviews',reviewRoutes)


module.exports = app