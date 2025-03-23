import { Remove, Add, Delete } from '@mui/icons-material'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Button } from '@mui/material'
import { currencyFormat } from '../../app/util/util';
import {  BasketItem } from '../../app/models/Basket';
import { useAppDispatch, useAppSelector } from '../contact/configureStore';
import { addBasketItemAsync, removeBasketItemAsync } from './basketSlice';

interface Props{
    items: BasketItem[],
    isBasket: boolean
}

function BasketTable({items, isBasket}:Props) {
console.log(items);
 const {status} = useAppSelector(state=>state.basket);
  const dispatch = useAppDispatch();
   function handleAdditem(productId: number) {
     dispatch(addBasketItemAsync({productId,quantity:1}));
   }
 
   function handleRemoveitem(productId: number, quantity:number=1,name?:string) {
     dispatch(removeBasketItemAsync({productId,quantity, name}));
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
          {items.map(item => (
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
                {isBasket && <Button 
                       loading={status === ('pendingRemoveItem'+item.productId+'Rem')} 
                       onClick={()=>handleRemoveitem(item.productId,1,'Rem')} 
                      color='error' >
                    <Remove />
                </Button>}
                {item.quantity}
                {isBasket && <Button 
                    loading={status === ('pendingAddItem'+item.productId)}  
                    onClick={()=>handleAdditem(item.productId)}>
                    <Add />
                </Button>}
                </TableCell>
              <TableCell align="right">{currencyFormat(item.price*item.quantity)}</TableCell>
              <TableCell align="center">
              {isBasket && <Button 
                loading={status === ('pendingRemoveItem'+item.productId+'Del')}  
                onClick={()=>handleRemoveitem(item.productId,item.quantity,'Del')} 
                color="error">
                    <Delete />
                </Button>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>    
      </>
  )

}

export default BasketTable