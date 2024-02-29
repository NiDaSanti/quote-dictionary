import React, {useContext, useState, useEffect} from 'react'
import { ClientContext } from '../../context/ClientProvider'
import { AppBar, Box, Button, Paper, TextField, Toolbar, Typography } from '@mui/material'
import headLogo from '../../images/qd-logo.PNG'
import '../Header/header.css'
import ServicePercentage from '../ServicePercentage/servicePercentage'
// import {grey} from '@mui/material/colors'

// const textColor = grey[50]
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
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <img 
            className="head-logo"
            src={headLogo} 
            alt="Quote dictionary head logo"
          />
        </Toolbar>
        <Box sx={{padding: 1}}>
          <Typography textAlign="left">Total number of clients on file: <i>{clientCount}</i></Typography>
          <Typography textAlign="left">Estimated amount of total dollars: $<i>{totalDollars}</i></Typography>
          <Typography textAlign="left">
            <Button
              variant="contained"
              color={formOpenAndClose ? 'error' : 'secondary'}
              // className={formOpenAndClose ? 'form-close' : 'form-active'} 
              onClick={formToggle}>{formOpenAndClose ? 'Close Form':'Open Form'}
            </Button>
          </Typography>
        </Box>
      </AppBar>
      <Typography textAlign="left">
        <ServicePercentage />
        <TextField
          fullWidth
          // fullWidth
          variant="standard"
          label="Search Clients"
          // className="search-input"
          type="text"
          onChange={handleSearch}
        />
      </Typography>
    </Box>
  )
}
export default Header

