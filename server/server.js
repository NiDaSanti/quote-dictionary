const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const clientsRoutes = require('./routes/clients')
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']

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
// Commented out the line related to serving uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`)
  next() // Pass the request to the next middleware/route
});

app.use('/api/clients', clientsRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong')
});

app.listen(port, () => {
  console.log(`Hello, Welcome to Quote Dictionary and I'm in port ${port}`)
})
