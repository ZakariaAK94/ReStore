import { Box, Divider, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Product } from '../../app/models/Product'

function ProductDetails() {
  const {id} = useParams<{id:string}>()
  const [product, setProduct] = useState<Product | null >(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    axios.get(`http://localhost:5000/api/Products/${id}`)
     .then(response => setProduct(response.data))
     .catch(err => console.log(err))
     .finally(()=>setLoading(false));

  },[id])

  if(loading) return <h3>Loading...</h3>

  if(!product) return <h2>Product not found</h2>

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








  //   <Box
  //   display="grid"
  //   gridTemplateColumns={{
  //       xs: "1fr",          // 1 column on extra-small screens
  //       sm: "repeat(2, 1fr)", // 2 columns on small screens
  //       md: "repeat(3, 1fr)", // 3 columns on medium screens and up
  //   }}
  //   gap={3} 
  //   justifyContent="center"                
  //   >
  //   {products.map((product) => (
  //       <Box key={product.id} sx={{border: "1px solid #ddd", borderRadius: 2 }}>
  //           <ProductCard product={product} />
  //       </Box>
  //       ))}
  //  </Box>
  )
}

export default ProductDetails

