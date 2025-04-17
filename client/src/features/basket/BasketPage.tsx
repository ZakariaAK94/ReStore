import { Alert, Box, Button, Typography } from '@mui/material';
import BasketSummary from './BasketSummary';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../contact/configureStore';
import BasketTable from './BasketTable';

function BasketPage() {
     
  const {basket} = useAppSelector(state=>state.basket);
  const subtotal = basket?.items?.reduce((sum,item)=> sum += (item.price) *item.quantity,0) ?? 0;
 
 if(!basket ) return <Typography variant='h3'>basket is empty, please add items!!</Typography>

  return (
    <>
    <BasketTable items={basket.items} isBasket={true} />
    <Box 
        display="grid" 
        gridTemplateColumns={{
          xs: "1fr",   
          sm: "repeat(2, 1fr)", 
          md: "repeat(2, 1fr)"
        }}
        
        gridTemplateRows={{
          xs: "1fr",   
          sm: "repeat(2, 1fr)", 
          md: "repeat(2, 1fr)"
        }} 
          >
         <Box />
         <Box>
             <BasketSummary items={basket.items} />
         </Box>
         <Box />
         <Box>
         <Button component={Link} to='/checkout' size="large"  variant="contained" fullWidth sx={{p:2}} disabled={subtotal===0}>
              Check out
         </Button>
         {subtotal===0 && <Alert severity="error" sx={{ mt: 2 }}>
                            Please visit the <Link to="/catalog">Catalog</Link> to choose a product before checking out.
                          </Alert>
          }                       
         </Box>       
      </Box>
    </>
  )
}

export default BasketPage