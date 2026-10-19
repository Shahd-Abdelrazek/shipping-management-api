const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const shipmentRouter = require('./routers/shipment')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(shipmentRouter)

app.get('/', (req, res) => res.send({ message: 'Shipping Management API is running' }))

app.listen(port, () => console.log('Server running on port ' + port))

module.exports = app
