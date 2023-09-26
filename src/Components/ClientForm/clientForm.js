import React, { useContext, useState, useRef } from 'react'
import { ClientContext } from '../../context/ClientProvider'
import '../ClientForm/clientForm.css'

const ClientForm = () => {
  // Use the client context to access clients and setClients
  const { clients, setClients, handleAddClient } = useContext(ClientContext)

  // State to hold form data
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
    // Removed the 'image' state as it's not needed now
    totalQuote: '',
  });

  // State to track image uploading (removed)
  // const [isUploadingImage, setIsUploadingImage] = useState(false);

  // State for error messages
  // const [errorMessage, setErrorMessage] = useState('');

  // Ref to the file input element (removed)
  // const imageInputRef = useRef(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  };

  // Handle image file selection (removed)
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     image: file,
  //   }));
  // };

  // Function to upload the image to Airtable (removed)
  // const uploadImageToAirtable = async (image) => {
  //   try {
  //     // ... (removed)
  //   } catch (error) {
  //     // ... (removed)
  //   }
  // }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
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
        const formDataObject = {
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
        }

        const response = await fetch(`/api/clients/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataObject),
        })

        console.log('FORMDATAOBJECT', formDataObject)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to create record: ${errorData.error}`)
        }

        const responseData = await response.json()
        console.log('Response:', responseData)

        // Only clear the form data if the request was successful
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
          totalQuote: '',
        })

        // Check if responseData.records is an array and has at least one item
        if (responseData.records && Array.isArray(responseData.records) && responseData.records.length > 0) {
          handleAddClient(responseData.records)
          console.log('Record created successfully!')
        } else {
          console.error('Invalid responseData.records:', responseData.records)
        }
      } else {
        console.error('Form validation failed. Please fill in all required fields.')
      }
    } catch (error) {
      console.error('Failed to create record', error)
    }
  }

  // If clients are undefined, display a loading message
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
        {/* Removed the 'Upload Image' input */}
        <label>Quote Total:</label>
        <input type="text" name="totalQuote" value={formData.totalQuote} onChange={handleChange} />
        <button className='new-client-submit' type="submit">
          {/* Removed 'disabled' attribute */}
          Create
        </button>
      </form>
    </div>
  );
};

export default ClientForm
