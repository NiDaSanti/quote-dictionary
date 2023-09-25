import React from "react"
import '../ClientInformation/clientInformation.css'

const ClientInformation = ({client, onClose}) => {
  return (
    <div className='modal'>
      <div className='modal-content'>
        <h2>Client Information</h2>
        <div>Name: {client.fields.fullName}</div>
        <div>Address: {client.fields.address}</div>
        <div>Email: {client.fields.email}</div>
        <div>Phone Number: {client.fields.phone}</div>
        <div>Date of Start: {client.fields.startDate}</div>
        <div>Date of End: {client.fields.endDate}</div>
        <div>Service (Job) Type: {client.fields.serviceType}</div>
        <div>Job Description: {client.fields.request}</div>
        {/* Commented out the image rendering */}
        {/* <div>Snapshots of Proof:</div>
        <img src={client.fields.image[0].thumbnails.large.url} alt='job' /> */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default ClientInformation
