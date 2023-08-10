import React, { useContext, useState } from 'react'
import { ClientContext } from '../../context/ClientProvider'
import { AIRTABLE_API_KEY, AIRTABLE_BASEID, AIRTABLE_TABLENAME } from '../../utils/api'
import ClientInformation from '../ClientInformation/clientInformation'
import '../ClientList/clientList.css'

const ClientList = () => {
  const {clients, setClients} = useContext(ClientContext)
  const  [selectClient, setSelectClient] = useState(null)
  let totalOfAllQuotes = 0

  for(let i = 0; i < clients.length; i++) {
    let convertToNum = Number(clients[i].fields.totalQuote)
    totalOfAllQuotes += convertToNum
  }
  const convertToStr = totalOfAllQuotes.toString()
  const handleRemoveClient = async (clientId) => {
    try {
      const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASEID}/${AIRTABLE_TABLENAME}/${clientId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      })
      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status)
      }
      // After successful deletion, update the state to remove the client
      setClients((prevClients) => prevClients.filter((client) => client.id !== clientId))
      console.log('Client removed successfully!')
    } catch (error) {
      console.error('Failed to remove client: ' + error)
    }
  }

  if(!clients || clients.length === 0) {
    return<div>Loading...</div>
  }

  const renderImage = (client) => {
    const imageObject = client.fields.image?.[0]
    if(imageObject) {
      return(
        <img src={imageObject.url} alt={'Snapshot'} width='50' height='50' />
      )
    } else {
      return <div>No image available.</div>
    }
  }

  const handleRowClick = (client) => {
    console.log('Selected Client', client)
    setSelectClient(client)
  }

  const handleCloseModal = () => {
    setSelectClient(null)
  }
  return(
    <>
      <div className='table-title'>Client List</div>
      <div className='client-amount'>
        <p>Client count: {clients.length}</p>
        <p>Total in dollars: ${convertToStr}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Remove Client</th>
            <th>Date of Client Entry</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Priority</th>
            <th>Service Type</th>
            <th>Request</th>
            <th>Image upload</th>
            <th>Quote Total</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const dateObj = new Date(client.createdTime)
            const dateAndTimeConvert = dateObj.toLocaleString()
            const picId = client.fields.image?.[0]
            console.log(picId)
            // const imageUrl = picId ? `https://api.airtable.com/v0/${AIRTABLE_BASEID}/${AIRTABLE_TABLENAME}/${picId.filename}` : null;

            console.log(picId)
            return(
              <tr key={client.id} onClick={() => handleRowClick(client)}>
                <td>
                  <button className='remove-client-submit' onClick={() => handleRemoveClient(client.id)}>Delete</button>
                </td>
                <td>{dateAndTimeConvert}</td>
                <td>{client.fields.fullName}</td>
                <td>{client.fields.email}</td>
                <td>{client.fields.phone}</td>
                <td>{client.fields.address}</td>
                <td>{client.fields.startDate}</td>
                <td>{client.fields.endDate}</td>
                <td>{client.fields.priority}</td>
                <td>{client.fields.serviceType}</td>
                <td>{client.fields.request}</td>
                <td>{renderImage(client)}</td>
                <td>${client.fields.totalQuote}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {selectClient && (
        <ClientInformation client={selectClient} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default ClientList