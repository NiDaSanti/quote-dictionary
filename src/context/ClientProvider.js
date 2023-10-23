import React, { createContext, useState, useEffect } from 'react';

const ClientContext = createContext();

const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/clients')  
      .then(response => response.json())
      .then(data => {
        setClients(data);
      })
      .catch(error => {
        setError(error);
      })
  }, [])

  const handleAddClient = (newClientRecords) => {
    setClients((prevClients) => [...prevClients, ...newClientRecords])
  }

  // const updateClient = (clientId, updatedData, callback) => {
  //   console.log('Updating client with ID:', clientId, 'updatedData:', updatedData)
  //   const updatedClients = clients.map((client) =>
  //     client.id === clientId ? { ...client, fields: updatedData } : client
  //   )
  //   setClients(updatedClients)
    
  //   if(callback) {
  //     callback()
  //   }
  // }

  const updateClient = (clientId, updatedData) => {
    const updatedClients = clients.map((client) =>
      client.id === clientId ? { ...client, fields: updatedData } : client
    );
    console.log('Updated clients:', updatedClients);
    setClients(updatedClients);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <ClientContext.Provider value={{ clients, setClients, handleAddClient, updateClient }}>{children}</ClientContext.Provider>
};

export { ClientContext, ClientProvider }