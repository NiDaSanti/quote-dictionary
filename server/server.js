const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())


app.listen(port, () => {
  console.log(`Hello, Welcome to Quote Dictionary and I'm in port ${port}`)
})