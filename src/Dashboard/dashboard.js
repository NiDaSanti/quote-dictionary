import React, {useState} from 'react'
import ClientForm from '../Components/ClientForm/clientForm'
import ClientList from '../Components/ClientList/clientList'
import Header from '../Components/Header/header'
// import Footer from '../Components/Footer/footer.js'
import { ClientProvider } from '../context/ClientProvider'

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  //Handle open or close toogle
  const toggleForm = () => {
    setIsOpen(!isOpen)
  }
  const handleSearch = (query) => {
    setSearchQuery(query)
  }
  return(
    <>
      <ClientProvider>
        <Header 
          onSearch={handleSearch} 
          formToggle={toggleForm} 
          formOpenAndClose={isOpen} 
        />
        <ClientForm 
          formOpenAndClose={isOpen} 
          formToggle={toggleForm}
        />
        <ClientList 
          searchQuery={searchQuery} 
          formOpenAndClose={isOpen}
        />
        {/* <Footer /> */}
      </ClientProvider>
    </>
  )
}
export default Dashboard