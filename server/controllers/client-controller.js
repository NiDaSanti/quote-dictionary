require('dotenv').config()
const fetch = require('node-fetch')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const FormData = require('form-data')

const API_KEY = process.env.AIRTABLE_API_KEY
const BASEID = process.env.AIRTABLE_BASEID
const TABLENAME = process.env.AIRTABLE_TABLENAME
const MAX_MB = 10

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir)
    }
    cb(null, uploadDir)
  },
  filename(req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
}).single('image')

const uploadImage = async (req, res) => {
  upload(req, res, async function (err) {
    try {
      if (err) {
        console.error('Failed to upload image:', err)
        return res.status(500).json({ error: 'Failed to upload image' })
      }

      if (!req.file) {
        console.error('No image uploaded')
        return res.status(400).json({ error: 'No image uploaded' })
      }
      console.log('req.file:', req.file)
      const imageAttachements = [
        {
          filename: req.file.originalname,
        }
      ]

      const recordFields = {
        fields: {
          image: imageAttachements,
        }
      }
      console.log('recordsFields', recordFields)
      const formData = new FormData()
      formData.append('records', JSON.stringify(recordFields))
      formData.append('image', fs.createReadStream(req.file.path), {
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
      })

      console.log('formData contents:', formData)
      const imageResponse = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        body: formData,
      })

      console.log('Image Response: ', imageResponse)
      if (!imageResponse.ok) {
        const errorData = await imageResponse.json()
        console.error('Failed to upload image:', errorData)
        return res.status(500).json({ ok: false, error: 'Failed to upload image.' })
      }

      const imageData = await imageResponse.json()
      const uploadImageId = imageData.id

      console.log('Image uploaded:', uploadImageId)
      return res.status(200).json({ ok: true, uploadImageId })
    } catch (error) {
      console.error('Failed to upload image to Airtable', error)
      res.status(500).json({ error: 'Failed to upload image' })
    }
  })
}

const createClient = async (req, res) => {
  try {
    const formData = req.body
    const uploadedImageId = await uploadImage(req, res)

    const formDataObject = {
      fields: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        startDate: formData.startDate,
        endDate: formData.endDate,
        priority: formData.priority,
        serviceType: formData.serviceType,
        request: formData.request,
        image: [
          {
            id: uploadedImageId,
            filename: formData.image ? formData.image.name : null,
            size: formData.image ? formData.size : null,
            type: formData.image ? formData.type : null,
          },
        ],
        totalQuote: formData.totalQuote
      },
    }
   console.log('Just to see Form Data Object ', formDataObject)
    const response = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}`, {
      method: 'POST', // Use POST to create a new record
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({records:[formDataObject]}),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Failed to create client', errorData)
      throw new Error('Failed to create client.')
    }

    const responseData = await response.json()
    const createdRecordId = responseData.records[0].id
    console.log('Created Record Id: ', createdRecordId)
    console.log(responseData.message)
    console.log('Image Data:', formDataObject.image)

    res.status(201).json({ message: 'Client created successfully' })
  } catch (error) {
    console.error('Error when attempting to create a client.', error)
    res.status(500).json({ error: 'Failed to create client.' })
  }
}

const removeClient = async (req, res) => {
  try {
    const { clientId } = req.params

    const response = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}/${clientId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to remove client.')
    }

    res.status(200).json({ message: 'Client removed successfully!' })
  } catch (error) {
    console.error('Error removing client:', error)
    res.status(500).json({ error: 'Failed to remove client.' })
  }
}

const getClientsData = async (req, res) => {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    console.log('Response Status:', response.status)
    const responseData = await response.json()
    console.log('Response Data:', responseData)
    const clients = responseData.records
    res.json(clients)
  } catch (error) {
    console.error('Error fetching client data:', error)
    res.status(500).json({ error: 'An error occurred while fetching client data' })
  }
}

module.exports = { createClient, removeClient, uploadImage, getClientsData }