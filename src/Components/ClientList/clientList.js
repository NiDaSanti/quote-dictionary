import React, { useContext, useState, useEffect } from 'react'
import { ClientContext } from '../../context/ClientProvider'
import ClientInformation from '../ClientInformation/clientInformation'
import '../ClientList/clientList.css'

const ClientList = ({searchQuery, formOpenAndClose}) => {
  const { clients, setClients, updateClient } = useContext(ClientContext)
  const [selectClient, setSelectClient] = useState(null)
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  //save for a more complex solution.
  // const [askToDelete, setAskToDelete] = useState(null)

  useEffect(() => {
    const handleResize = () => {
      const newInnerWidth = window.innerWidth
      setWindowWidth(newInnerWidth)
    }
    window.addEventListener('resize', handleResize)

    return() => {
      window.removeEventListener('resize', handleResize)
    }
  },[clients])
  
  const handleRemoveClient = async (clientId) => {
    const confirmDeletedClient = window.confirm("Are you sure you want to remove this client?")
    if(confirmDeletedClient) {
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
  }

  const handleUpdateClient = (clientId, updatedData) => {
    console.log("Updating client with ID:", clientId, "updatedData:", updatedData)
    updateClient(clientId, updatedData)
    console.log("After update, clients:", clients)
  }

  const filteredClients = clients.filter((client) => {
    const fullName = client.fields.fullName.toLowerCase()
    const email = client.fields.email.toLowerCase()
    const phone = client.fields.phone.toLowerCase()
    const address = client.fields.address.toLowerCase()
    const totalQuote = client.fields.totalQuote.toLowerCase()
    const search = searchQuery.toLowerCase()
    
    const matchesSearchQuery = 
      fullName.includes(search) ||
      email.includes(search) ||
      phone.includes(search) ||
      address.includes(search) ||
      totalQuote.includes(search) 

    const matchesPriorityFilter = selectedPriority === "All" || client.fields.priority === selectedPriority

    return matchesSearchQuery && matchesPriorityFilter
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
    {clients.length === 0 ? (
      <div className="zero-client-container">
        <div className="welcome">Welcome to client prototype.</div>
        <div className="welcome-message">You currently have no clients logged. Please submit client by clicking <strong><i>"Open Client Form"</i></strong> button above.</div>
      </div>
    ) : 
      windowWidth > 768 ?
        <div className={formOpenAndClose ? 'table-container' : 'table-container-position-toggled'}>
          <aside className="control-panel">
            <label className="priority-filter-label">Filter priority: </label>
            <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </aside>
          <table>
            <thead>
              <tr>
                <th>Remove Client</th>
                <th>Date of Client Entry</th>
                <th>Priority</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Start Date</th>
                <th>End Date</th>
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
                    <div className="desktop-priority-indicator">
                      <div className="priority-dot-container">
                        <div className={client.fields.priority === 'High' ? 
                          'priority-high': client.fields.priority === 'Medium' ? 
                          'priority-medium' : 'priority-low'}>
                        </div>
                      </div>
                      <td>
                        {client.fields.priority}
                      </td>
                    </div>
                    <td>{client.fields.fullName}</td>
                    <td>{client.fields.email}</td>
                    <td>{client.fields.phone}</td>
                    <td>{client.fields.address}</td>
                    <td>{client.fields.startDate}</td>
                    <td>{client.fields.endDate}</td>
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
          <aside className="control-panel">
          <label className="priority-filter-label">Filter priority: </label>
            <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </aside>
          {filteredClients.map((client) => {
          return(
            <article className={client.fields.priority === 'High' ? 
              "client-card-priority-high" : 
              "client-card"} key={client.id} onClick={(event) => handleRowClick(client, event)}>
              <div className="priority-dot-container">
                <div className={client.fields.priority === 'High' ? 
                  'priority-high': client.fields.priority === 'Medium' ? 
                  'priority-medium' : 'priority-low'}>
                </div>
              </div>
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
            

             
