import React, {useState, useContext} from "react"
import UpdateClient from '../UpdateClient/updateClient'
import { ClientContext } from '../../context/ClientProvider'
import '../ClientInformation/clientInformation.css'
import { Button, Paper, Typography } from "@mui/material"

const ClientInformation = ({client, onClose}) => {
  const {updateClient} = useContext(ClientContext)
  const [isSelected, setIsSelected] = useState(null)
  
  const handleClientUpdateClick = () => {
    setIsSelected(client)
  }

  const handleCloseUpdateForm = () => {
    setIsSelected(null)
  }

  const updateClientInformation = (updatedData) => {
    updateClient(client.id, updatedData)
  }
  
  return (
    <Paper elevation={1}>
      <div className={`modal ${isSelected ? 'open' : ''}`}>
        <div className='modal-content'>
          <Typography variant="h5" color="text.secondary" textAlign="center">Client Information</Typography> 
          <Typography>Name: {client.fields.fullName}</Typography>
          <Typography>Address: {client.fields.address}</Typography>
          <Typography>Email: {client.fields.email}</Typography>
          <Typography>Phone Number: {client.fields.phone}</Typography>
          <Typography>Est. Job start date: {client.fields.startDate}</Typography>
          <Typography>Est. Job end date: {client.fields.endDate}</Typography>
          <Typography>Service (Job) Type: {client.fields.serviceType}</Typography>
          <Typography>Priority: {client.fields.priority}</Typography>
          <Typography>Job Description: {client.fields.request}</Typography>
          <Typography variant="h6" color="text.secondary">Price: $ {client.fields.totalQuote}</Typography>
          <button className="close-button" onClick={onClose}>X</button>
          <button className="update-btn" onClick={handleClientUpdateClick}>Edit</button>
          {isSelected && (
            <div className="update-form-container">
              <UpdateClient 
                clientId={client.id} 
                onUpdate={handleClientUpdateClick} 
                onUpdateClose={handleCloseUpdateForm} 
                closeOnEdit={onClose}
                clientUpdateInformation={updateClientInformation}
              />
            </div>
          )}
        </div>
      </div>
    </Paper>
  )
}

export default ClientInformation

