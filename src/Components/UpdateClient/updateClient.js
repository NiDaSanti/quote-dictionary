import React, {useState, useContext, useEffect} from 'react'
import { ClientContext } from '../../context/ClientProvider'
import './updateClient.css'

const UpdateClient = ({clientId, onUpdate, onUpdateClose}) => {
  const {clients} = useContext(ClientContext)
  const [selected, setSelected] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    priority: '',
    serviceType: '',
    request: '',
    totalQuote: '',
  })

  useEffect(() => {
    const clientData = clients.find((client) => client.id === clientId)
    
    if(clientData) {
      setFormData({
        fullName: clientData.fullName || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        address: clientData.address || '',
        priority: clientData.priority || '',
        serviceType: clientData.serviceType || '',
        request: clientData.request || '',
        totalQuote: clientData.totalQuote || '',
      })
    }
  }, [clientId, clients])

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value,})
  }

  const handleOnClose = () => {
    setSelected(false)
  }
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/update-client/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json', 
        },
        body: JSON.stringify(formData),
      })

      if(!response.ok) {
        throw new Error('Failed to update client.')
      }

      onUpdate(formData)
      // handleAddClient([formData])
      // setFormData({...formData})
    } catch(error) {
      console.error('Error updating client:', error)
    }
  }
  return(
    <>
      <h2>Update Client Data</h2>
      <div className="form">
        <section className="left-side">
          <label><strong>Name:</strong></label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} />
          <label>Email:</label>
          <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
        </section>
        <section className="right-side">
          <label>Priority:</label>
          <input type="text" name="priority" value={formData.priority} onChange={handleInputChange} />
          <label>Service Type:</label>
          <input type="text" name="serviceType" value={formData.serviceType} onChange={handleInputChange} />
          <label>Request:</label>
          <textarea type="text" name="request" value={formData.request} onChange={handleInputChange} rows="4" cols="10" />
          <label>Quote Total:</label>
          <input type="text" name="totalQuote" value={formData.totalQuote} onChange={handleInputChange} />
        </section>
      </div>
      <button className="client-update-btn" onClick={handleUpdate}>Update</button>
      <button className="close-update-form-btn" onClick={onUpdateClose}>Close</button>
    </>
  )
}
export default UpdateClient
  