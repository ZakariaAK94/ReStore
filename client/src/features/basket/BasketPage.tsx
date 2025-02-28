import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Add, Delete, Remove } from '@mui/icons-material';
import { useStoreContext } from '../../app/Context/StoreContext';
import { useState } from 'react';
import Agent from '../../app/api/agent';
import BasketSummary from '../basketSummary/BasketSummary';
import { currencyFormat } from '../../app/util/util';
import { Link } from 'react-router-dom';

function BasketPage() {
     
  const {basket, setBasket, removeItem} = useStoreContext();
  const [Statusloading, setLoading] = useState<{ [key: string]: boolean }>({});

 if(!basket) return <Typography variant='h3'>basket is empty, please add items!!</Typography>

  function handleAdditem(productId: number, name:string) {
    setLoading(prev=> ({...prev,[name]:true}));
    Agent.Basket.addItems(productId)
      .then((basket)=>setBasket(basket))
      .catch(err => console.log(err))
      .finally(()=>setLoading(prev=> ({...prev,[name]:false})));
  }

  function handleRemoveitem(productId: number, quantity:number=1, name:string) {
    setLoading(prev=> ({...prev,[name]:true}))
    Agent.Basket.removeItems(productId,quantity)
      .then(()=>removeItem(productId,quantity))
      .catch(err => console.log(err))
      .finally(()=>setLoading(prev=> ({...prev,[name]:false})));
  }

  return (
    <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} >
        <TableHead>
          <TableRow>
            <TableCell >Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {basket.items.map(item => (
            <TableRow
              key={item.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>
                <Box display='flex' alignItems='center' >
                  <img src={item.pictureUrl} alt={item.name} style={{height:50, marginRight:20}} />
                  <span>{item.name}</span>
                </Box>
                </TableCell>
              <TableCell align="right">{currencyFormat(item.price)}</TableCell>
              <TableCell align="center">
                <Button 
                       loading={Statusloading['rem'+item.productId]} 
                       onClick={()=>handleRemoveitem(item.productId,1,'rem'+item.productId)}
                      color='error' >
                    <Remove />
                </Button>
                {item.quantity}
                <Button 
                    loading={Statusloading['add'+item.productId]}  
                    onClick={()=>handleAdditem(item.productId,'add'+item.productId)}>
                    <Add />
                </Button>
                </TableCell>
              <TableCell align="right">{currencyFormat(item.price*item.quantity)}</TableCell>
              <TableCell align="center">
                <Button 
                loading={Statusloading['del'+item.productId]}  
                onClick={()=>handleRemoveitem(item.productId,item.quantity,'del'+item.productId)} 
                color="error">
                    <Delete />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Box 
        display="grid" 
        gridTemplateColumns="repeat(2, 1fr)" 
        gridTemplateRows="repeat(2, 1fr)" 
          >
         <Box />
         <Box>
             <BasketSummary />
         </Box>
         <Box />
         <Box>
          <Button component={Link} to='/checkout' size="large"  variant="contained" fullWidth sx={{p:2}}>
              Check out
          </Button>
         </Box>       
      </Box>
    </>
  )
}

export default BasketPage