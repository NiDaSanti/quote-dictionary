import React, {useContext, useEffect, useState} from "react"
import { ClientContext } from '../../context/ClientProvider'
import { Box, Paper, Stack, Typography } from "@mui/material"
import { blue } from '@mui/material/colors'
const percentBackgroundColor = blue[700]
const ServicePercentage = () => {
  const { loading, clients } = useContext(ClientContext)
  const totalJobs = clients.length
  const [demoPercentage, setDemoPercentage] = useState(0)
  const [trashPercentage, setTrashPercentage] = useState(0)
  const [cleanPercentage, setCleanPercentage] = useState(0)
  const [landscapePercentage, setLandscapePercentage] = useState(0)
  
  useEffect(() => {
    let demo = 0
    let trash = 0
    let land = 0
    let clean = 0
    
    for(let i = 0; i < clients.length; i++) {
      if(clients[i].fields.serviceType === 'Demolition') {
        demo++
      } else if(clients[i].fields.serviceType === 'Trash Haul') {
        trash++
      } else if(clients[i].fields.serviceType === 'Landscaping') {
        land++
      } else {
        clean++
      }
    }
  
    const getAllPercentages = (job) => {
      const percentages = (job / totalJobs) * 100
      return percentages.toFixed(1)
    }
  
    const demoPercent = getAllPercentages(demo)
    const trashPercent = getAllPercentages(trash)
    const cleanPercent = getAllPercentages(clean)
    const landPercent = getAllPercentages(land)
    setDemoPercentage(demoPercent)
    setTrashPercentage(trashPercent)
    setCleanPercentage(cleanPercent)
    setLandscapePercentage(landPercent)
  },[clients, totalJobs])

  return(
    <>
      <Box sx={{padding: 2, background: percentBackgroundColor }}>
        {!loading ? ('Loading...') : (<Paper sx={{padding: 2}} elevation={1}>
          <Typography textAlign="left" variant="h6">Job percentage breakdown.</Typography>
          <Stack direction={{xs: 'column', sm: 'row'}} spacing={{sm: 2, md: 4}} useFlexGap flexWrap="wrap">
            <Typography textAlign="left">Demolition: {demoPercentage}%</Typography>
            <Typography textAlign="left">Trash Haul: {trashPercentage}%</Typography>
            <Typography textAlign="left">Housekeeping: {cleanPercentage}%</Typography>
            <Typography textAlign="left">Landscaping: {landscapePercentage}%</Typography>
          </Stack>
        </Paper>)}
      </Box>
    </>
  )
}

export default ServicePercentage