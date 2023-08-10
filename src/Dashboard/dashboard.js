import React from 'react'
import ClientForm from '../Components/ClientForm/clientForm'
import ClientList from '../Components/ClientList/clientList'
import { ClientProvider } from '../context/ClientProvider'

const Dashboard = () => {
  return(
    <>
      <ClientProvider>
        <ClientForm />
        <ClientList />
      </ClientProvider>
    </>
  )
}
export default Dashboard