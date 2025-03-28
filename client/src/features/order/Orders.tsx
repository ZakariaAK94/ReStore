import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Order } from '../../app/models/Order';
import Agent from '../../app/api/agent';
import { currencyFormat } from '../../app/util/util';
import LoadingComponent from '../../app/layout/LoadingComponent';

import OrderDetailed from './OrderDetailed';

function Orders() {

 const[loading, setLoading] = useState(true);
 const [currentOrder, setOrder] = useState<Order | null>(null);
 const[isClickedView,setIsClickedView  ] = useState(false);
 const[orders, setOrders] = useState<Order[] | null>(null);

 useEffect(()=>{
    Agent.Order.list()
    .then(respose => setOrders(respose))
    .catch(err => console.log(err))
    .finally(()=>setLoading(false))
 },[]);

 function handleViewClicked(order:Order)
 {    
      setIsClickedView(true);
      setOrder(order);
 }

 if(loading) return <LoadingComponent message='Loading orders...' />;
 
  return (
     <>
      {
      isClickedView ===false ?
          (
          <TableContainer component={Paper}>      
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Order Number</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Order Date</TableCell>
                    <TableCell align="right">Order Status</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders?.map((order) => (
                    <TableRow
                      key={order.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {order.id}
                      </TableCell>
                      <TableCell align="right">{currencyFormat(order.total)}</TableCell>
                      <TableCell align="right">{order.date.split('T')[0]}</TableCell>
                      <TableCell align="right">{order.orderStatus}</TableCell>
                      <TableCell align="right">
                        <Button onClick={()=>handleViewClicked(order)}>View</Button>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>   
          </TableContainer>
          )
          :
          (
            <OrderDetailed order={currentOrder} setIsClickedView={setIsClickedView}/>
          ) 
      }
     </>
    )    
}

export default Orders