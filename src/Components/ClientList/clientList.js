import React, { useContext, useState } from 'react'
import { ClientContext } from '../../context/ClientProvider'
import ClientInformation from '../ClientInformation/clientInformation'
import ClientClickableRow from '../ClientClickableRow/clientClickableRow'
import '../ClientList/clientList.css'
import { setSelectionRange } from '@testing-library/user-event/dist/utils'

const ClientList = () => {
  const { clients, setClients } = useContext(ClientContext)
  const [selectClient, setSelectClient] = useState(null)
  let totalOfAllQuotes = 0;
  for (let i = 0; i < clients.length; i++) {
    let convertToNum = Number(clients[i].fields.totalQuote)
    totalOfAllQuotes += convertToNum
  }
  const convertToStr = totalOfAllQuotes.toString()

  const handleRemoveClient = async (clientId) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status)
      }
      // After successful deletion, update the state to remove the client
      setClients((prevClients) => prevClients.filter((client) => client.id !== clientId))
      console.log('Client removed successfully!');
    } catch (error) {
      console.error('Failed to remove client: ' + error)
    }
  }

  // const handleUpdateClient = (updatedClient) => {
  //   const updatedIndex = clients.findIndex((client) => client.id === updatedClient.id)

  //   if(updatedIndex !== -1) {
  //     const updatedClients = [...clients]
  //     updatedClients[updatedIndex] = updatedClient
  //     setClients(updatedClients)
  //   }
  //   setSelectClient(null)
  // }

  if (!clients || clients.length === 0) {
    return <div>Loading...</div>;
  }

  const handleRowClick = (client, event) => {
    if(event.target.className === 'remove-client-submit') {
      return
    }
    setSelectClient(client)
  }

  const handleCloseModal = () => {
    setSelectClient(null)
  }
  
  return (
    <>
      <div className='client-amount'>
        <p>Client count: {clients.length}</p>
        <p className="number">Total in dollars: $<i>{convertToStr}</i></p>
      </div>
      <div className="table-container">
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
              {/* Removed the 'Image upload' header */}
              <th>Quote Total</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const dateObj = new Date(client.createdTime)
              const dateAndTimeConvert = dateObj.toLocaleString()

              return (
                <tr key={client.id} onClick={(event) => handleRowClick(client, event)}>
                  <td>
                    <button className='remove-client-submit' onClick={() => handleRemoveClient(client.id)}>
                      Delete
                    </button>
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
                  <td>
                    <div>{client.fields.request}</div>
                  </td>
                  {/* Removed the image rendering */}
                  <td className="quote-total"><i>${client.fields.totalQuote}</i></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectClient && (<ClientInformation client={selectClient} onClose={handleCloseModal} />)}
    </>
  );
};

export default ClientList
