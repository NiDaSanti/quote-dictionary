/*
Do not remove the commented code as it will be utilized 
for continued creation for uploading images.
*/ 
require('dotenv').config()
const fetch = require('node-fetch')
// const multer = require('multer')
// const path = require('path')
// const fs = require('fs').promises
// const admin = require('firebase-admin')
// const serviceAccount = require('../../firebase/quote-dictionary-dd591-firebase-adminsdk-oryow-de78f66265.json')
// Firebase storage init for image storage
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
// });

const API_KEY = process.env.AIRTABLE_API_KEY
const BASEID = process.env.AIRTABLE_BASEID
const TABLENAME = process.env.AIRTABLE_TABLENAME
// const MAX_MB = 10
// Middleware to handle images
// const storage = multer.diskStorage({
//   async destination(req, file, cb) {
//     const uploadDir = path.join(__dirname, '..', 'uploads')
//     try {
//       await fs.mkdir(uploadDir);
//     } catch (error) {
//       if (error.code !== 'EEXIST') {
//         console.error('Failed to create upload directory:', error)
//       }
//     }
//     cb(null, uploadDir);
//   },
//   filename(req, file, cb) {
//     cb(null, file.originalname)
//   },
// })

// const upload = multer({
//   storage,
//   limits: { fileSize: MAX_MB * 1024 * 1024 },
// }).single('image')
// Function of to upload image into firebase storage. Then it returns the image url once uploaded in firebase storage
// const uploadImage = async (req, res) => {
//   try {
//     console.log('Request received at /upload-image')
//     // Handle image upload using multer middleware
//     upload(req, res, async function (err) {
//       if (err instanceof multer.MulterError) {
//         console.error('Multer Error:', err)
//         return res.status(500).json({ error: 'Failed to upload image' })
//       } else if (err) {
//         console.error('Unknown Error:', err)
//         return res.status(500).json({ error: 'An error occurred while uploading the image' })
//       }

//       if (!req.file) {
//         console.error('No file uploaded')
//         return res.status(400).json({ error: 'No file uploaded' })
//       }

//       const imageFileName = `${Date.now()}_${req.file.originalname}`
//       const file = admin.storage().bucket().file(imageFileName)
//       const stream = file.createWriteStream({
//         metadata: {
//           contentType: req.file.mimetype,
//         },
//       })

//       stream.end(req.file.buffer)

//       const [url] = await file.getSignedUrl({
//         action: 'read',
//         expires: '12-30-2023', // This needs to change asap
//       })

//       // console.log('Image uploaded:', url)

//       // Respond with the image URL as JSON data
//       return res.status(200).json({ url })
//     });
//   } catch (error) {
//     console.error('Failed to upload image to Firebase', error);
//     res.status(500).json({ error: 'Failed to upload image to Firebase' })
//   }
// }

const createClient = async (req, res) => {
  try {
    console.log('Received POST request to create client:', req.body)
    const formData = req.body

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
        totalQuote: formData.totalQuote,
      },
    }

    const response = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataObject),
    })

    console.log('Response:', response);
    console.log('Response from Airtable API:', {
      status: response.status,
      statusText: response.statusText,
    })

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `Failed to create client - Status: ${response.status}, Status Text: ${response.statusText}. Airtable Error: ${JSON.stringify(
        errorData
      )}`
      console.error(errorMessage);
      res.status(500).json({ error: 'Failed to create client.' })
      return
    }

    const responseData = await response.json()
    console.log('RESPONSE DATA:', responseData)
    // Assuming your Airtable table has an 'ID' field
    const airtableId = responseData.id; // Adjust this based on your Airtable schema
    // Fetch the newly created client using the airtableId
    const fetchResponse = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}/${airtableId}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch the newly created client.`)
    }

    const fetchedData = await fetchResponse.json()

    // Send the fetched client data in the response
    res.status(201).json({ message: 'Client created successfully', records: [fetchedData] })
  } catch (error) {
    console.error('Error when attempting to create a client.', error)
    res.status(500).json({ error: 'Failed to create client.' })
  }
}

const editClient = async (req, res) => {
  try {
    const {id} = req.params
    const updatedClient = req.body
    const response = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({fields: updatedClient})
    })
    if(!response.ok) {
      const errorData = await response.json()
      const errorMessage = `Failed to update client - Status: ${response.status}, Status Text: ${response.statusText}. Airtable Error: ${JSON.stringify(errorData)}`
      console.error(errorMessage)
      res.status(500).json({error: 'Failed to update client.'})
      return
    }

    const responseData = await response.json()
    console.log('Response Data:', responseData)

    res.status(200).json({message: 'Client updated succesfully'})

  } catch(error) {
    console.error('Error when attempting to update client. ', error)
    res.status(500).json({error: 'Failed to update client'})
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
    console.log('Response Data:', responseData.records)
    const clients = responseData.records
    res.json(clients)
  } catch (error) {
    console.error('Error fetching client data:', error)
    res.status(500).json({ error: 'An error occurred while fetching client data' })
  }
}

module.exports = { createClient, editClient, removeClient, getClientsData }
