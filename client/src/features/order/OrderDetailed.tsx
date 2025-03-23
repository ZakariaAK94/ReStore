import { Box, Typography, Button } from '@mui/material'
import React from 'react'
import { BasketItem } from '../../app/models/Basket'
import BasketSummary from '../basket/BasketSummary'
import BasketTable from '../basket/BasketTable'
import { Order } from '../../app/models/Order'

interface Props{
    order: Order | null,
    setIsClickedView:(isClicked:boolean)=>void
}

function OrderDetailed({order, setIsClickedView}:Props) {
  return (
    <Box>
    <Box display='flex' justifyContent='space-between' alignItems='center' sx={{p:2}} >
      <Typography variant='h4'>order#{order?.id}-{order?.orderStatus}</Typography>
      <Button onClick={()=>setIsClickedView(false)} variant='outlined' size="large">BACK TO ORDERS</Button>
    </Box>
    <BasketTable items={order?.orderItems as BasketItem[]} isBasket={false} />
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" >
              <Box />
              <Box>
                  <BasketSummary items={order?.orderItems as BasketItem[]}/>
              </Box>
    <Box />
    </Box>
  </Box>
  )
}

export default OrderDetailed