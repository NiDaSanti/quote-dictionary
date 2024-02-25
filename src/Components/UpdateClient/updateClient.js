import React, { useState, useContext, useEffect, useRef } from 'react'
import { Button, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { ClientContext } from '../../context/ClientProvider'
import './updateClient.css'
import {red} from '@mui/material/colors'

const danger = red[500]
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
      <Typography textAlign="center" variant="h5" color={danger}>Update Client Data</Typography>
      {/* <div className="form"> */}
        {/* <section className="left-side"> */}
          {/* <div className="form-field"> */}
            {/* <label>Name:</label> */}
            <TextField
              label="Full Name"
              fullWidth
              type="text"
              name="fullName"
              size="small"
              value={formData.fullName}
              onChange={handleInputChange}
              variant="standard"
            />
          {/* </div> */}
          {/* <div className="form-field"> */}
            {/* <label>Email:</label> */}
            <TextField
              label="Email Address"
              fullWidth
              type="text"
              name="email"
              value={formData.email}
              size="small"
              onChange={handleInputChange}
              variant="standard"
            />
          {/* </div> */}
          {/* <div className="form-field"> */}
            {/* <label>Phone:</label> */}
            <TextField
              fullWidth
              label="Phone number"
              type="text"
              name="phone"
              value={formData.phone}
              size="small"
              onChange={handleInputChange}
              variant="standard"
            />
          {/* </div> */}
          {/* <div className="form-field"> */}
            {/* <label>Address:</label> */}
            <TextField
              fullWidth 
              label="Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              variant="standard"
            />
          {/* </div> */}
          {/* <div className='service-dates'> */}
            {/* <div className='form-field'> */}
              <label className="start-date">Start Date:</label>
              <input 
                type="date" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleInputChange} 
              />
            {/* </div> */}
            {/* <div className='form-field'> */}
              <label className="end-date">End Date:</label>
              <input 
                type="date" 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleInputChange} 
              />
            {/* </div> */}
          {/* </div> */}
        {/* </section> */}
        
        {/* <section className="right-side"> */}
          {/* <div className="form-field"> */}
            {/* <label>Priority:</label> */}
            <InputLabel>Priority</InputLabel>
            <Select fullWidth variant="standard" name="priority" id="priority" value={formData.priority} onChange={handlePriorityChange} ref={selectRef}>
              <MenuItem>Select an option.</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          {/* </div> */}
          {/* <div className="form-field"> */}
            {/* <label>Service Type:</label> */}
            <TextField
              label="Service Type"
              variant="standard"
              fullWidth
              type="text"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              size="small"
            />
          {/* </div> */}
          {/* <div className="form-field"> */}
            {/* <label>Request:</label> */}
            <TextField
              label="Request Description"
              fullWidth
              variant="standard"
              type="text"
              name="request"
              value={formData.request}
              onChange={handleInputChange}
              rows={4}
            />
          {/* </div> */}
          {/* <div className="form-field"> */}
            {/* <label>Quote Total:</label> */}
            <TextField
              type="text"
              variant="standard"
              fullWidth
              label="Quote Total"
              name="totalQuote"
              value={formData.totalQuote}
              onChange={handleInputChange}
            />
          {/* </div> */}
        {/* </section> */}
      {/* </div> */}
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
