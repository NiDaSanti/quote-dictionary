import React, { useContext, useState, useRef } from 'react';
import { ClientContext } from '../../context/ClientProvider';
import '../ClientForm/clientForm.css';

const ClientForm = () => {
  const { clients, setClients } = useContext(ClientContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    startDate: '',
    endDate: '',
    priority: '',
    serviceType: '',
    request: '',
    image: null,
    totalQuote: '',
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const imageInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const uploadImageToAirtable = async (image) => {
    try {
      const imageFormData = new FormData()
      const imageAttachements = [
        {
          // filename: formData.image.name,
          url: `http://localhost:3000/uploads/${formData.image.name}`
        },
      ]
      console.log(imageAttachements)
      const recordFields = {
        fields: {
          image: imageAttachements,
        }
      }
      imageFormData.append('records', JSON.stringify([recordFields]))
      imageFormData.append('image', image);

      const imageResponse = await fetch(`http://localhost:3000/api/clients/upload-image`, {
        method: 'POST',
        body: imageFormData,
      })
      console.log('Request URL:', `/api/clients/upload-image`)
      console.log('Image Response:', imageResponse)
      if (!imageResponse.ok) {
        const errorData = await imageResponse.json()
        console.error('Failed to upload image:', errorData)
        throw new Error('Failed to upload image')
      }

      const imageData = await imageResponse.json();
      const uploadedImageId = imageData.uploadImageId

      return uploadedImageId;
    } catch (error) {
      console.error('Failed to upload image to Airtable', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        formData.fullName &&
        formData.email &&
        formData.phone &&
        formData.address && 
        formData.startDate &&
        formData.endDate &&
        formData.priority &&
        formData.serviceType &&
        formData.request &&
        formData.totalQuote
      ) {
        // Step 1: Upload the image and get the image ID
        setIsUploadingImage(true)
        const uploadedImageId = await uploadImageToAirtable(formData.image)
  
        // Step 2: Create the main record with the linked image
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
                filename: formData.image ? formData.image.name : null, // Use the filename from the uploaded image
                size: formData.image ? formData.image.size : null, // Use the size from the uploaded image
                type: formData.image ? formData.image.type : null, // Use the type from the uploaded image
                thumbnails: {
                  small: {}, // You can leave the thumbnails empty if not available
                  large: {},
                },
              },
            ],
            totalQuote: formData.totalQuote
          },
        }
          
  
        const response = await fetch(`http://localhost:3000/api/clients/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({records: [formDataObject]}), // Wrap formDataObject inside 'records' array
        })
  
        if (!response.ok) {
          throw new Error('Failed to create record')
        }
  
        const responseData = await response.json()
        setClients((prevClients) => [...prevClients, responseData.records[0]])
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          startDate: '',
          endDate: '',
          priority: '',
          serviceType: '',
          request: '',
          image: null,
          totalQuote: '',
        })
        console.log('Record created successfully!')
      } else {
        console.error('Please fill in all required fields and add an image.')
      }
    } catch (error) {
      console.error('Failed to create record', error)
      setIsUploadingImage(false)
    }
  }
  if (clients === undefined) {
    return <div>Loading...</div>
  }

  return (
    <div className='client-form-container'>
      <form className='client-submission' onSubmit={handleSubmit}>
        <div className='title-post-form'>Client Service Request Form</div>
        <label>Name:</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
        <label>Email:</label>
        <input type="text" name="email" value={formData.email} onChange={handleChange} />
        <label>Phone:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
        <div className='service-dates'>
          <label>Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          <label>End Date:</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
        </div>
        <label>Priority:</label>
        <input type="text" name="priority" value={formData.priority} onChange={handleChange} />
        <label>Service Type:</label>
        <input type="text" name="serviceType" value={formData.serviceType} onChange={handleChange} />
        <label>Request:</label>
        <textarea name="request" value={formData.request} onChange={handleChange} rows="4" cols="50" />
        <label>Upload Image:</label>
        <input type="file" accept='image/*' name="image" onChange={handleImageChange} ref={imageInputRef} />
        <label>Quote Total:</label>
        <input type="text" name="totalQuote" value={formData.totalQuote} onChange={handleChange} />
        <button className='new-client-submit' type="submit" disabled={isUploadingImage}>{isUploadingImage ? 'Creating...' : 'Create Client'}</button>
      </form>
    </div>
  );
};

export default ClientForm;