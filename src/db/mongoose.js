const mongoose = require('mongoose')
const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/shipping-api'
mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch((e) => console.log('DB connection error:', e.message))
