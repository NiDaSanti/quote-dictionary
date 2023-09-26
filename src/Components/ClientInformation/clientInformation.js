import React, {useState} from "react"
import UpdateClient from '../UpdateClient/updateClient'
import '../ClientInformation/clientInformation.css'

const ClientInformation = ({client, onClose}) => {
  const [isSelected, setIsSelected] = useState(null)

  const handleClientUpdateClick = () => {
    setIsSelected(client)
  }

  const handleCloseUpdateForm = () => {
    setIsSelected(null)
  }
  return (
    <div className='modal'>
      <h2>Client Information</h2>
      <div className="info-and-update-form-content">
        <div className='modal-content'>
          <p><strong>Name:</strong> {client.fields.fullName}</p>
          <p><strong>Address:</strong> {client.fields.address}</p>
          <p><strong>Email:</strong> {client.fields.email}</p>
          <p><strong>Phone Number:</strong> {client.fields.phone}</p>
          <p><strong>Date of Start:</strong> {client.fields.startDate}</p>
          <p><strong>Date of End:</strong> {client.fields.endDate}</p>
          <p><strong>Service (Job) Type:</strong> {client.fields.serviceType}</p>
          <p><strong>Job Description:</strong> {client.fields.request}</p>
          <p><strong>Total Amount: $<i className="price">{client.fields.totalQuote}</i></strong></p>
          {/* Commented out the image rendering */}
          {/* <div>Snapshots of Proof:</div>
          <img src={client.fields.image[0].thumbnails.large.url} alt='job' /> */}
          <button onClick={onClose}>Close</button>
          <button onClick={handleClientUpdateClick}>Update</button>
        </div>
        <div className="update-form-container">
          {isSelected && (<UpdateClient onUpdate={handleClientUpdateClick} onUpdateClose={handleCloseUpdateForm}/>)}
        </div>
      </div>
    </div>
  )
}

export default ClientInformation

