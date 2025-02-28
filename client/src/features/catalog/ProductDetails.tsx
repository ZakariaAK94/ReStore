import { Box, Button, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Product } from '../../app/models/Product'
import Agent from '../../app/api/agent'
import NotFound from '../../app/api/errors/NotFound'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { useStoreContext } from '../../app/Context/StoreContext'

function ProductDetails() {
  const {basket, setBasket, removeItem} = useStoreContext();
  const {id} = useParams<{id:string}>()
  const [product, setProduct] = useState<Product | null >(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const item = basket?.items.find(item=>item.productId === +id! );
  const[quantity,setQuantity]=useState(0);

  useEffect(()=>{
    if(item) setQuantity(item.quantity)
    id && Agent.Catalog.details(parseInt(id))
     .then(response => setProduct(response))
     .catch(err => console.log(err))
     .finally(()=>setLoading(false));

  },[id,item])

  if(loading) return <LoadingComponent message='Loading product...' />

  if(!product) return <NotFound />

  function handleInputChange(event: any) {
    if(event.target.value >=0)
          setQuantity(event.target.value);
  }

  function handleUpdate()
  {
    console.log("1 quantity: "+ quantity);
    console.log("1 item quantity: "+ item?.quantity);
    if(!item || item.quantity - quantity < 0)
    {
      const newQuantity = item ? quantity - item.quantity: quantity;
      setSubmitting(true);
      Agent.Basket.addItems(product?.id!,newQuantity)
           .then(basket => setBasket(basket))
           .catch(error => console.log(error))
           .finally(()=>setSubmitting(false));
    }else
    {
      const newQuantity = item.quantity-quantity;
      setSubmitting(true);
      Agent.Basket.removeItems(product?.id!,newQuantity)
           .then(()=>removeItem(product?.id!,newQuantity))
           .catch(error => console.log(error))
           .finally(()=>setSubmitting(false));
    }
  }

  return (  
    
        <Box 
          display="grid" 
          gridTemplateColumns="repeat(2, 1fr)" 
          gap={6}
          sx={{ height: '70%' }}
        >
            <Box >
                <img src={product.pictureUrl} alt={product.name} style={{width:'100%', height:'80%'}} />
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
                   loading={submitting} 
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

