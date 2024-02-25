import React, {useContext, useState, useEffect} from 'react'
import { ClientContext } from '../../context/ClientProvider'
import { Button, Paper, Typography } from '@mui/material'
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
      <div className="logo-container">
        <img 
          className="head-logo"
          src={headLogo} 
          alt="Quote dictionary head logo"
        />
      </div>
      <input
        className="search-input"
        type="text"
        placeholder="Search clients"
        onChange={handleSearch}
      />
      <Paper elevation={3} sx={{padding: 1}}>
        <Typography textAlign="left">Total number of clients on file: <i>{clientCount}</i></Typography>
        <Typography textAlign="left">Estimated amount of total dollars: $<i>{totalDollars}</i></Typography>
        <Button
          variant="outlined"
          color="success"
          className={formOpenAndClose ? 'form-close' : 'form-active'} 
          onClick={formToggle}>{formOpenAndClose ? 'Close Form':'Open Form'}
        </Button> 
      </Paper>
    </div>
  )
}
export default Header

