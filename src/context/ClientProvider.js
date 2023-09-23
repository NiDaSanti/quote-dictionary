import React, { createContext, useState, useEffect } from 'react';

const ClientContext = createContext();

const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // You can call your API endpoint here to fetch the client data from the server
    fetch('/api/clients')  // Use the full URL here
      .then(response => response.json())
      .then(data => {
        console.log('In ClientProvider:', data);
        setClients(data);
      })
      .catch(error => {
        setError(error);
      });
  }, [])

  const handleAddClient = (newClientRecords) => {
    setClients((prevClients) => [...prevClients, ...newClientRecords])
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <ClientContext.Provider value={{ clients, setClients, handleAddClient }}>{children}</ClientContext.Provider>;
};

export { ClientContext, ClientProvider };




