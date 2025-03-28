import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutPage from './CheckoutPage';
import { useAppDispatch } from '../../contact/configureStore';
import { useEffect, useState } from 'react';
import Agent from '../../../app/api/agent';
import { setBasket } from '../../basket/basketSlice';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const stripePromise = loadStripe('pk_test_51R5xUHG81XEK7h9miBOXlYhwHyPHagH49ZkQEZZJqUtym9jvwPSS50e3UL91Da1dPnGXCnCd1mlOzp4WLrXAaRzP00b4JRQxT1');

export default function CheckoutWrapper() {
  const dispatch = useAppDispatch();
  const[laoding, setLoading] = useState(true);

  useEffect(()=>{
    Agent.Payment.createPaymentIntent()
    .then(basket => dispatch(setBasket(basket)))
    .catch(error => console.log(error))
    .finally(()=>setLoading(false));

  },[dispatch]);

  if(laoding) return <LoadingComponent message='Loading checkout...' />
  
  return (
    <Elements stripe={stripePromise} >
      <CheckoutPage />
    </Elements>
  );
};