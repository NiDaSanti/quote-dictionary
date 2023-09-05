const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const clientsRoutes = require('./routes/clients')

const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000'] // Add your frontend URLs here

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
app.use(bodyParser.json())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/clients', clientsRoutes)



app.listen(port, () => {
  console.log(`Hello, Welcome to Quote Dictionary and I'm in port ${port}`)
})