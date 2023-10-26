import React, { useState, useContext, useEffect, useRef } from 'react'
import { ClientContext } from '../../context/ClientProvider'
import './updateClient.css'

const UpdateClient = ({ clientId, onUpdate, onUpdateClose, closeOnEdit }) => {
  const { clients, updateClient } = useContext(ClientContext)
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
    totalQuote: ''
  })

  const selectRef = useRef(null)
  useEffect(() => {
    const client = clients.find(client => client.id === clientId)

    if (client) {
      setFormData({
        fullName: client.fields.fullName,
        email: client.fields.email,
        phone: client.fields.phone,
        address: client.fields.address,
        startDate: client.fields.startDate,
        endDate: client.fields.endDate,
        priority: client.fields.priority,
        serviceType: client.fields.serviceType,
        request: client.fields.request,
        totalQuote: client.fields.totalQuote
      })
    }
  }, [clientId, clients])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handlePriorityChange = (e) => {
    const priorityChoice = e.target.value
    setFormData({...formData, priority: priorityChoice})
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const updatedClientData = { ...formData };
      const response = await fetch(`/api/clients/update-client/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update client.')
      }
      const responseData = await response.json()
      updateClient(clientId, updatedClientData)
      closeOnEdit()
      onUpdateClose()
   
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
        totalQuote: ''
      })
    } catch (error) {
      console.error('Error updating client:', error)
    }
  }

  return (
    <>
      <h2>Update Client Data</h2>
      <div className="form">
        <section className="left-side">
          <div className="form-field">
            <label>Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-field">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-field">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-field">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className='service-dates'>
            <div className='form-field'>
              <label>Start Date:</label>
              <input 
                type="date" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleInputChange} 
              />
            </div>
            <div className='form-field'>
              <label>End Date:</label>
              <input 
                type="date" 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </section>
        
        <section className="right-side">
          <div className="form-field">
            <label>Priority:</label>
            <select name="priority" id="priority" onChange={handlePriorityChange} ref={selectRef}>
              <option>Select an option.</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className="form-field">
            <label>Service Type:</label>
            <input
              type="text"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-field">
            <label>Request:</label>
            <textarea
              type="text"
              name="request"
              value={formData.request}
              onChange={handleInputChange}
              rows="4"
              cols="10"
            />
          </div>
          <div className="form-field">
            <label>Quote Total:</label>
            <input
              type="text"
              name="totalQuote"
              value={formData.totalQuote}
              onChange={handleInputChange}
            />
          </div>
        </section>
      </div>
      <button className="client-update-btn" onClick={handleUpdate}>
        Save
      </button>
      <button className="close-update-form-btn" onClick={onUpdateClose}>
        Close
      </button>
    </>
  )
}

export default UpdateClient
