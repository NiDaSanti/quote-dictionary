import React, {useState} from 'react'
import ClientForm from '../Components/ClientForm/clientForm'
import ClientList from '../Components/ClientList/clientList'
import Header from '../Components/Header/header'
import { ClientProvider } from '../context/ClientProvider'

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (query) => {
      setSearchQuery(query)
    }
  return(
    <>
      <ClientProvider>
        <Header onSearch={handleSearch}/>
        <ClientForm />
        <ClientList searchQuery={searchQuery}/>
      </ClientProvider>
    </>
  )
}
export default Dashboard