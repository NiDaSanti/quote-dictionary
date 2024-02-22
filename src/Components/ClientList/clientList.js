import React, { useContext, useState, useEffect } from 'react'
import { ClientContext } from '../../context/ClientProvider'
import ClientInformation from '../ClientInformation/clientInformation'
import {Accordion, AccordionDetails, AccordionSummary, Button, Card, CardContent, Container, Paper, Stack, Typography} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {blue} from '@mui/material/colors'
import '@fontsource/roboto/500.css';
import '../ClientList/clientList.css'

const textColor = blue[600]
const ClientList = ({searchQuery, formOpenAndClose}) => {
  const { clients, setClients, updateClient } = useContext(ClientContext)
  const [selectClient, setSelectClient] = useState(null)
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [isLoading, setIsLoading] = useState(false)
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
    {isLoading ? ('Loading Clients...') : (
          <Paper elevation={3}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1-content" id="panel1-header">
                <Typography variant="h6" color={textColor}>All Clients:</Typography>
                <Typography variant="h6" color="text.secondary">{filteredClients.length}</Typography>
              </AccordionSummary>
                <AccordionDetails>
                  <Container maxWidth="xxl">
                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={{xs: 1, sm: 2, md: 4}} useFlexGap flexWrap="wrap" justifyContent="center">
                      {filteredClients.map((client) => (
                        <Card sx={{minWidth: 50}}>
                          <CardContent>
                            <Typography textAlign="right">{client.fields.priority}</Typography>
                            <Typography color={textColor} textAlign="left" variant="h6" component="div">{client.fields.fullName}</Typography>
                            <Typography textAlign="left">{client.fields.phone}</Typography>
                            <Typography textAlign="left" sx={{fontSize: 14}}>{client.fields.email}</Typography>
                            <Typography textAlign="left">{client.fields.serviceType}</Typography>
                            <Button onClick={() => handleRemoveClient(client.id)} variant="outlined" color="error">Delete Client</Button>
                            <Button onClick={(event) => handleRowClick(client, event)} variant="outlined" color="info">Click for Info</Button>
                          </CardContent>
                        </Card>
                      ))
                    }
                  </Stack>
                </Container>
              </AccordionDetails>
            </Accordion>
          </Paper>
      // windowWidth > 768 ?
      //   <div className={formOpenAndClose ? 'table-container' : 'table-container-position-toggled'}>
      //     <aside className="control-panel">
      //       <label className="priority-filter-label">Filter priority: </label>
      //       <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
      //         <option value="All">All</option>
      //         <option value="High">High</option>
      //         <option value="Medium">Medium</option>
      //         <option value="Low">Low</option>
      //       </select>
      //     </aside>
      //     <table>
      //       <thead>
      //         <tr>
      //           <th>Remove Client</th>
      //           <th>Date of Client Entry</th>
      //           <th>Priority</th>
      //           <th>Name</th>
      //           <th>Email</th>
      //           <th>Phone</th>
      //           <th>Address</th>
      //           <th>Start Date</th>
      //           <th>End Date</th>
      //           <th>Service Type</th>
      //           <th>Request</th>
      //           {/* Removed the 'Image upload' header */}
      //           <th>Quote Total</th>
      //         </tr>
      //       </thead>
      //       <tbody>
      //         {filteredClients.map((client) => {
      //           const dateObj = new Date(client.createdTime)
      //           const dateAndTimeConvert = dateObj.toLocaleString()

      //           return (
      //             <tr className="table-row" key={client.id} onClick={(event) => handleRowClick(client, event)}>
      //               <td>
      //                 <button className='remove-client-submit' onClick={() => handleRemoveClient(client.id)}>
      //                   Delete
      //                 </button>
      //               </td>
      //               <td>{dateAndTimeConvert}</td>
      //               <div className="desktop-priority-indicator">
      //                 <div className="priority-dot-container">
      //                   <div className={client.fields.priority === 'High' ? 
      //                     'priority-high': client.fields.priority === 'Medium' ? 
      //                     'priority-medium' : 'priority-low'}>
      //                   </div>
      //                 </div>
      //                 <td>
      //                   {client.fields.priority}
      //                 </td>
      //               </div>
      //               <td>{client.fields.fullName}</td>
      //               <td>{client.fields.email}</td>
      //               <td>{client.fields.phone}</td>
      //               <td>{client.fields.address}</td>
      //               <td>{client.fields.startDate}</td>
      //               <td>{client.fields.endDate}</td>
      //               <td>{client.fields.serviceType}</td>
      //               <td>
      //                 <div>{client.fields.request}</div>
      //               </td>
      //               <td className="quote-total"><i>${client.fields.totalQuote}</i></td>
      //             </tr>
      //           );
      //         })}
      //       </tbody>
      //     </table>
      //   </div> : 
      //   <div className={formOpenAndClose ? "mobile-card-container-open-toggle" : "mobile-card-container-close-toggle"}>
      //     <aside className="control-panel">
      //     <label className="priority-filter-label">Filter priority: </label>
      //       <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
      //         <option value="All">All</option>
      //         <option value="High">High</option>
      //         <option value="Medium">Medium</option>
      //         <option value="Low">Low</option>
      //       </select>
      //     </aside>
      //     {filteredClients.map((client) => {
      //     return(
      //       <article className={client.fields.priority === 'High' ? 
      //         "client-card-priority-high" : 
      //         "client-card"} key={client.id} onClick={(event) => handleRowClick(client, event)}>
      //         <div className="priority-dot-container">
      //           <div className={client.fields.priority === 'High' ? 
      //             'priority-high': client.fields.priority === 'Medium' ? 
      //             'priority-medium' : 'priority-low'}>
      //           </div>
      //         </div>
      //         <section>
      //           <div className="mobile-client-name">{client.fields.fullName}</div>
      //           <div>{client.fields.email}</div>
      //           <div>{client.fields.phone}</div>
      //         </section>
      //         <section>
      //           <div>{client.fields.priority}</div>
      //           <div>{client.fields.serviceType}</div>
      //           <div className="mobile-total-quote">$ <i>{client.fields.totalQuote}</i></div>
      //         </section>
      //         <button className='remove-client-submit' onClick={() => handleRemoveClient(client.id)}>
      //           Delete
      //         </button>
      //       </article>
      //       )
      //     })}
      //   </div> 
    )}
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
            

             
