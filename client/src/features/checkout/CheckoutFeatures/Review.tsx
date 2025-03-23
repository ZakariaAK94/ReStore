import { Box, Typography } from '@mui/material';
import BasketTable from '../../basket/BasketTable';
import { useAppSelector } from '../../contact/configureStore';
import BasketSummary from '../../basket/BasketSummary';

export default function Review() {
  const {basket} = useAppSelector(state => state.basket);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket && <BasketTable items={basket?.items} isBasket={false} />}
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" >
         <Box />
         <Box>
             <BasketSummary items={basket!.items}/>
         </Box>               
      </Box>
    </>
  );
}