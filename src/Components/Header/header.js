import React, {useContext, useState, useEffect} from 'react'
import { ClientContext } from '../../context/ClientProvider'
import headLogo from '../../images/qd-logo.PNG'
import '../Header/header.css'

const Header = ({onSearch, formToggle, formOpenAndClose}) => {
  const { clients } = useContext(ClientContext)
  const [totalDollars, setTotalDollars] = useState(0)
  const [clientCount, setClientCount] = useState(0)

  const addAllQuoteTotals = () => {
    let total = 0
    for(let i = 0; i < clients.length; i++) {
      let convertToNum = Number(clients[i].fields.totalQuote) 
      total += convertToNum
    } 
    setTotalDollars(total)
    return total.toString()
  }

  const handleSearch = (e) => {
    onSearch(e.target.value)
  }

  useEffect(()=> {
    const result =  addAllQuoteTotals()
    setClientCount(clients.length)
  }, [clients])

  return(
    <div className="header-container">
      <img 
        className="head-logo"
        src={headLogo} 
        alt="Quote dictionary head logo"
      />
      <input
        className="search-input"
        type="text"
        placeholder="Search clients"
        onChange={handleSearch}
      />
      <aside className="aside-container">
        <div>Total number of clients on file: <i>{clientCount}</i></div>
        <div>Estimated amount of total dollars: $<i>{totalDollars}</i></div>
        <div>Client Form:<button className={formOpenAndClose ? 'form-close' : 'form-active'} onClick={formToggle}>{formOpenAndClose ? 'Close':'Open'}</button></div> 
      </aside>
    </div>
  )
}
export default Header
