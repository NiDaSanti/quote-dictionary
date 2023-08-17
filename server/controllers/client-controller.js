require('dotenv').config()
const FormData = require('form-data')
const fetch = require('node-fetch')

const API_KEY = process.env.AIRTABLE_API_KEY
const BASEID = process.env.AIRTABLE_BASEID
const TABLENAME = process.env.AIRTABLE_TABLENAME

const getClientsData = async (req, res) => {
  try{
    const response = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })
    
    if(!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    console.log('Response Status:', response.status)
    const responseData = await response.json()
    console.log('Response Data:', responseData)
    const clients = responseData.records
    res.json(clients)
  } catch(error) {
    console.error('Error fetching client data:', error)
    res.status(500).json({error: 'An error occured while fetching client data'})
  }
}

const uploadImage = async (image) => {
  try {
    const imageFormData = new FormData()
    imageFormData.append('file', image, image.name)
    
    const imageResponse = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: imageFormData,
    });
    
    if (!imageResponse.ok) {
      const errorData = await imageResponse.json()
      console.error('Failed to upload image:', errorData)
      throw new Error('Failed to upload image')
    }
    
    const imageData = await imageResponse.json()
    const uploadImageId = imageData.id
    
    console.log('Image Data:', imageFormData)
    return uploadImageId
  } catch (error) {
    console.error('Failed to upload image to Airtable', error)
    throw error
  }
}

const createClient = async (req, res) => {
  try {
    const formData = req.body
    const uploadedImageId = await uploadImage(formData.image. createdRecordId)

    const formDataObject = {
      fields: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        startDate: formData.startDate,
        endDate: formData.endDate,
        priority: formData.priority,
        image: [
          {
            id: uploadedImageId,
            fileName: formData.image.name,
            size: formData.image.size,
            type: formData.image.type,
            thumbnails: {
              small: {},
              large: {}
            },
          },
        ],
        totalQuote: formData.totalQuote
      }
    }
    const response = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}`, {
      method: 'POST', // Use POST to create a new record
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [formDataObject] }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create client', errorData);
      throw new Error('Failed to create client.');
    }

    const responseData = await response.json();
    const createdRecordId = responseData.records[0].id;
    console.log(responseData.message);
    console.log('Image Data:', formData.image);

    res.status(201).json({ message: 'Client created successfully' });
  } catch (error) {
    console.error('Error when attempting to create a client.', error);
    res.status(500).json({ error: 'Failed to create client.' });
  }
};

const removeClient = async(req, res) => {
  try {
    const {clientId} = req.params

    const response = await fetch(`https://api.airtable.com/v0/${BASEID}/${TABLENAME}/${clientId}` , {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      }
    })
    
    if(!response.ok) {
      throw new Error('Failed to remove client.')
    }

    res.status(200).json({message: 'Client removed successfully!'})
  } catch(error) {
    console.error('Error removing client:', error)
    res.status(500).json({error: 'Failed to remove client.'})
  }
}

module.exports = {createClient, removeClient, uploadImage, getClientsData}