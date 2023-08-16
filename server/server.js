const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const clientsRoutes = require('./routes/clients')
const cors = require('cors')

app.use(bodyParser.json())
app.use(express.json())
app.use('/api/clients', clientsRoutes)
app.use(cors())



app.listen(port, () => {
  console.log(`Hello, Welcome to Quote Dictionary and I'm in port ${port}`)
})