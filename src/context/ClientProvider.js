import React, {createContext, useState, useEffect} from 'react'
import { AIRTABLE_API_KEY, AIRTABLE_BASEID, AIRTABLE_TABLENAME } from '../utils/api'

const ClientContext = createContext()

const ClientProvider = ({children}) => {
  const [clients, setClients] = useState([])
  const [error, setError] = useState(null)

  async function fetchData() {
    try {
      const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASEID}/${AIRTABLE_TABLENAME}`, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    )
      if(!response.ok) throw new Error('Request failed with status' + response.status)
      const responseData = await response.json()
      setClients(responseData.records)
    } catch(error) {
      setError(error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  if (error) {
    // Handle the error state here, you can display an error message or fallback UI
    return <div>Error: {error.message}</div>;
  }
  // If no error occurred, render the ClientContext.Provider with the clients state
  return <ClientContext.Provider value={{ clients, setClients }}>{children}</ClientContext.Provider>;
};

export { ClientContext, ClientProvider };




