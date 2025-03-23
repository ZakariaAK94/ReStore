import { Box, Button, Typography } from '@mui/material';
import BasketSummary from './BasketSummary';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../contact/configureStore';
import BasketTable from './BasketTable';

function BasketPage() {
     
  const {basket} = useAppSelector(state=>state.basket);
 
 if(!basket) return <Typography variant='h3'>basket is empty, please add items!!</Typography>

  

  return (
    <>
    <BasketTable items={basket.items} isBasket={true} />
    <Box 
        display="grid" 
        gridTemplateColumns="repeat(2, 1fr)" 
        gridTemplateRows="repeat(2, 1fr)" 
          >
         <Box />
         <Box>
             <BasketSummary items={basket.items} />
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