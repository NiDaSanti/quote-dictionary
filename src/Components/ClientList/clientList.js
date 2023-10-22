import fetch from 'node-fetch';
import React, { useContext, useState, useEffect } from 'react'
import { ClientContext } from '../../context/ClientProvider'
import ClientInformation from '../ClientInformation/clientInformation'
import '../ClientList/clientList.css'

const ClientList = ({searchQuery, formOpenAndClose}) => {
  const { clients, setClients } = useContext(ClientContext)
  const [selectClient, setSelectClient] = useState(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // let totalOfAllQuotes = 0;
  // for (let i = 0; i < clients.length; i++) {
  //   let convertToNum = Number(clients[i].fields.totalQuote)
  //   totalOfAllQuotes += convertToNum
  // }
  // const convertToStr = totalOfAllQuotes.toString()

  useEffect(() => {
    const handleResize = () => {
      const newInnerWidth = window.innerWidth
      setWindowWidth(newInnerWidth)
    }
    window.addEventListener('resize', handleResize)

    return() => {
      window.removeEventListener('resize', handleResize)
    }
  },[])
  
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
    } catch (error) {
      console.error('Failed to remove client: ' + error)
    }
  }

  const handleUpdateClient = (clientId, updatedData) => {
    setClients((prevClients) => {
      const updatedClients = prevClients.map((client) => {
        if(client.id === clientId) {
          return { ...client, fields: updatedData}
        }
        return client
      })
      return updatedClients
    })

  }

  if (!clients || clients.length === 0) {
    return <div>Loading...</div>;
  }

  const filteredClients = clients.filter((client) => {
    const fullName = client.fields.fullName.toLowerCase()
    const email = client.fields.email.toLowerCase()
    const phone = client.fields.phone.toLowerCase()
    const address = client.fields.address.toLowerCase()
    const totalQuote = client.fields.totalQuote.toLowerCase()
    const search = searchQuery.toLowerCase()
    return fullName.includes(search) || email.includes(search) || phone.includes(search) || address.includes(search) || totalQuote.includes(search)
   })

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
    {windowWidth > 768 ?
      <div className={formOpenAndClose ? 'table-container' : 'table-container-position-toggled'}>
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
            {filteredClients.map((client) => {
              const dateObj = new Date(client.createdTime)
              const dateAndTimeConvert = dateObj.toLocaleString()

              return (
                <tr className="table-row" key={client.id} onClick={(event) => handleRowClick(client, event)}>
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
      </div> : 
        <div className={formOpenAndClose ? "mobile-card-container-open-toggle" : "mobile-card-container-close-toggle"}>
          {filteredClients.map((client) => {
           return(
             <article className="client-card" key={client.id} onClick={(event) => handleRowClick(client, event)}>
               <section>
                <div className="mobile-client-name">{client.fields.fullName}</div>
                <div>{client.fields.email}</div>
                <div>{client.fields.phone}</div>
               </section>
               <section>
                 <div>{client.fields.priority}</div>
                 <div>{client.fields.serviceType}</div>
                 <div className="mobile-total-quote">$ <i>{client.fields.totalQuote}</i></div>
               </section>
              <button className='remove-client-submit' onClick={() => handleRemoveClient(client.id)}>
                Delete
              </button>
             </article>
           )
          })}
        </div>
      }
      {selectClient && (
        <ClientInformation 
          client={selectClient} 
          onClose={handleCloseModal} 
          onUpdate={handleUpdateClient}
        />
      )}
    </>
  );
};

export default ClientList


