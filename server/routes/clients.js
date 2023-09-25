const express = require('express')
const router = express.Router()
// const compression = require('compression');
const { createClient, /* uploadImage, */ removeClient, getClientsData, editClient } = require('../controllers/client-controller')
// Commented out the image upload route
// router.post('/upload-image', uploadImage)
router.post('/create', createClient)
router.delete('/:clientId', removeClient)
router.put('/update-client/:id', editClient)
router.get('/', getClientsData)

module.exports = router