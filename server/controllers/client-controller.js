require('dotenv').config()
const fetch = require('node-fetch')
const multer = require('multer')
const path = require('path')
const fs = require('fs').promises
const {promisify} = require('util')
const FormData = require('form-data')

const API_KEY = process.env.AIRTABLE_API_KEY
const BASEID = process.env.AIRTABLE_BASEID
const TABLENAME = process.env.AIRTABLE_TABLENAME
const MAX_MB = 10
const uploadedImageCustomUrl = `http://localhost:3000/uploads`

const storage = multer.diskStorage({
  async destination(req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads')
    try {
      await fs.mkdir(uploadDir)
    } catch(error) {
      if(error.code !== 'EEXIST') {
        console.error('Failed to create upload directory:', error)
      }
    }
    cb(null, uploadDir)
  },
  filename(req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
}).single('image')

const uploadImage = async (req) => {
  try {
    const imageAttachements = [
      {
        url: `${uploadedImageCustomUrl}/{req.file.originalname}`,
      },
    ];

    const recordFields = {
      fields: {
        image: imageAttachements,
      },
    };

    const formData = new FormData();
    formData.append('records', JSON.stringify([recordFields]));

    const imageResponse = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.json();
      console.error('Failed to upload image:', errorData);
      throw new Error('Failed to upload image');
    }

    const imageData = await imageResponse.json();
    const uploadImageId = imageData.records[0].id;
    console.log('Image uploaded:', uploadImageId);
    return uploadImageId;
  } catch (error) {
    console.error('Failed to upload image to Airtable', error);
    throw error;
  }
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