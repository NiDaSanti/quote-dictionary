import React, { useState, useContext, useEffect } from 'react'
import { ClientContext } from '../../context/ClientProvider'
import './updateClient.css'

const UpdateClient = ({ clientId, onUpdate, onUpdateClose }) => {
  const { clients } = useContext(ClientContext)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    priority: '',
    serviceType: '',
    request: '',
    totalQuote: ''
  })

  useEffect(() => {
    const client = clients.find(client => client.id === clientId)

    if (client) {
      setFormData({
        fullName: client.fields.fullName,
        email: client.fields.email,
        phone: client.fields.phone,
        address: client.fields.address,
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

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
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

      onUpdate(formData, () => {
        onUpdateClose()
      })

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
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
        </section>
        <section className="right-side">
          <div className="form-field">
            <label>Priority:</label>
            <input
              type="text"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            />
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
