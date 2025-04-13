import { Box, Button, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from '../../app/api/errors/NotFound'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { useAppDispatch, useAppSelector } from '../contact/configureStore'
import { addBasketItemAsync, removeBasketItemAsync} from '../basket/basketSlice'
import { fetchProductAsync, productSelector } from './catalogSlice'

function ProductDetails() {
  const {basket,status} = useAppSelector(state=>state.basket);
  const dispatch = useAppDispatch();
  const {id} = useParams<{id:string}>()
  const product = useAppSelector(state => productSelector.selectById(state,parseInt(id!)));
  const {status: productStatus} = useAppSelector(state=>state.catalog);
  const item = basket?.items.find(item=>item.productId === product.id! );
  const[quantity,setQuantity]=useState(0);

  useEffect(()=>{
    if(item) setQuantity(item.quantity)
    if(!product && id) dispatch(fetchProductAsync(parseInt(id!)));

  },[id,item,dispatch,product])

  if(productStatus.includes("pending")) return <LoadingComponent message='Loading product...' />

  if(!product) return <NotFound />

  function handleInputChange(event: any) {
    if(event.target.value >=0)
          setQuantity(parseInt(event.target.value));
  }

  function handleUpdate()
  {
    if(!item || item.quantity - quantity < 0)
    {
      const newQuantity = item ? quantity - item.quantity: quantity;
      dispatch(addBasketItemAsync({productId:product?.id!, quantity:newQuantity}))
    }else
    {
      const newQuantity = item.quantity-quantity;
      dispatch(removeBasketItemAsync({productId:product?.id!,quantity:newQuantity}))
    }
  }

  return (      
        <Box 
          display="grid" 
          gridTemplateColumns={{
            md : "repeat(2, 1fr)" ,
            xs: "1fr", 
            sm: "1fr"
          }} 
          gap={{md:6,xs:2,sm:2}}
          sx={{ height:'70%', mb:2}}
        >
            <Box>
                <img 
                src={product.pictureUrl} 
                alt={product.name} 
                style={{width:'100%', height:'80%'}}
                 />
            </Box>
            <Box>
              <Typography variant='h4'>{product.name}</Typography>
              <Divider sx={{mb:2}} />
              <Typography variant='h4' color='secondary'>${(product.price/100).toFixed(2)}</Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{product.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>{product.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>{product.type}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Brand</TableCell>
                      <TableCell>{product.brand}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Quantity in stock</TableCell>
                      <TableCell>{product.quantityInStock}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box 
              display="grid" 
              gridTemplateColumns="repeat(2, 1fr)" 
              gap={2}
              >
              <TextField  
                  variant="outlined" 
                  fullWidth 
                  type='number' 
                  value={quantity} 
                  label='Quantity in Cart' 
                  onChange={handleInputChange}
                  minRows={0}/>                
              
              <Button 
                  disabled={item?.quantity === quantity || quantity === 0}
                   loading={status ==='pending'} 
                   color='primary' 
                   variant="contained" 
                   sx={{height:'55px'}} 
                   size='large'
                   onClick={handleUpdate}>
                {item ? "Update quantity" : "Add to Cart"}
              </Button>
          </Box>
            </Box>            
      </Box>

  )
}

export default ProductDetails

