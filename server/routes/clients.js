const express = require('express')
const router = express.Router()
const {createClient, uploadImage, removeClient, getClientsData} = require('../controllers/client-controller')

router.post('/upload-image', uploadImage)
router.post('/create', createClient)
router.delete('/:clientId', removeClient)
router.get('/', getClientsData)

module.exports = router