import { Box, Divider, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Product } from '../../app/models/Product'
import Agent from '../../app/api/agent'
import NotFound from '../../app/api/errors/NotFound'
import LoadingComponent from '../../app/layout/LoadingComponent'

function ProductDetails() {
  const {id} = useParams<{id:string}>()
  const [product, setProduct] = useState<Product | null >(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    id && Agent.Catalog.details(parseInt(id))
     .then(response => setProduct(response))
     .catch(err => console.log(err))
     .finally(()=>setLoading(false));

  },[id])

  if(loading) return <LoadingComponent message='Loading product...' />

  if(!product) return <NotFound />

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
            </Box>
      </Box>

  )
}

export default ProductDetails

