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

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <ClientContext.Provider value={{ clients, setClients, handleAddClient }}>{children}</ClientContext.Provider>
};

export { ClientContext, ClientProvider }




