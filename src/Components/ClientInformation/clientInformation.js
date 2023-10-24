import React, {useState, useContext} from "react"
import UpdateClient from '../UpdateClient/updateClient'
import '../ClientInformation/clientInformation.css'
import { ClientContext } from '../../context/ClientProvider'

const ClientInformation = ({client, onClose}) => {
  const [isSelected, setIsSelected] = useState(null)
  const {clients} = useContext(ClientContext)
  
  const handleClientUpdateClick = () => {
    setIsSelected(client)
  }

  const handleCloseUpdateForm = () => {
    setIsSelected(null)
  }
  
  return (
    <div className={`modal ${isSelected ? 'open' : ''}`}>
      <div className='modal-content'>
        <h2>Client Information</h2>
        <p><strong>Name:</strong> {client.fields.fullName}</p>
        <p><strong>Address:</strong> {client.fields.address}</p>
        <p><strong>Email:</strong> {client.fields.email}</p>
        <p><strong>Phone Number:</strong> {client.fields.phone}</p>
        <p><strong>Date of Start:</strong> {client.fields.startDate}</p>
        <p><strong>Date of End:</strong> {client.fields.endDate}</p>
        <p><strong>Service (Job) Type:</strong> {client.fields.serviceType}</p>
        <p><strong>Importance:</strong>{client.fields.priority}</p>
        <p><strong>Job Description:</strong> {client.fields.request}</p>
        <p><strong>Total Amount: $<i className="price">{client.fields.totalQuote}</i></strong></p>
        {/* Commented out the image rendering */}
        {/* <div>Snapshots of Proof:</div>
        <img src={client.fields.image[0].thumbnails.large.url} alt='job' /> */}
        <button className="close-button" onClick={onClose}>X</button>
        <button className="update-btn" onClick={handleClientUpdateClick}>Edit</button>
        {isSelected && (
          <div className="update-form-container">
            <UpdateClient 
              clientId={client.id} 
              onUpdate={handleClientUpdateClick} 
              onUpdateClose={handleCloseUpdateForm} 
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientInformation

