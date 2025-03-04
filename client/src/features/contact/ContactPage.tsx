import { Button, Stack, Typography } from '@mui/material';

import { useAppDispatch, useAppSelector } from './configureStore';
import { decrement, increment, reset } from './counterSlice';

function ContactPage() 
{
  const dispath = useAppDispatch();
  const {data, title} = useAppSelector(state => state.counter);
 
  return (
    <>
    <Typography variant='h2'>{title}</Typography>
    <Typography variant='h5'>This is : {data}</Typography>    
    <Stack direction="row" spacing={2}>
        <Button sx={{mr:2}} onClick={()=>dispath(increment(1))} variant='contained' color='primary'>Increment</Button>
        <Button onClick={()=>dispath(reset(42))} variant='contained' color='secondary'>Reset to 42</Button>
        <Button sx={{ml:2}} onClick={()=>dispath(decrement(1))} variant='contained' color='error'>Decrement</Button>
     </Stack>     
    </>
  )
}

export default ContactPage