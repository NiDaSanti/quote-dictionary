const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const clientsRoutes = require('./routes/clients')
const cors = require('cors')
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

app.use(upload.none());
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(express.json())
app.use('/api/clients', clientsRoutes)
app.use(cors())



app.listen(port, () => {
  console.log(`Hello, Welcome to Quote Dictionary and I'm in port ${port}`)
})

app.post('/upload-image', upload.single('image'), function (req, res, next) {
  console.log(req.file, req.body)
})
