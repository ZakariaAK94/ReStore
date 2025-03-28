import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import { validationSchema } from "../FormValidation";
import Agent from "../../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../contact/configureStore";
import { clearBasket } from "../../basket/basketSlice";
import { StripeElementType } from "@stripe/stripe-js";
import { CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
const steps = ['Shipping address', 'Review your order', 'Payment details'];


export default function CheckoutPage()
{
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [orderNumber, setOrderNumber] = useState(0);
    const dispatch = useAppDispatch();
    const currentForm = validationSchema[activeStep];
    const[cardState, setCardState] = useState<{elementError:{[key in StripeElementType]?:string}}>({elementError:{}});
    const[cardComplete,setCardComplete] = useState<any>({CardNumber:false, CardExpiry:false, CardCvc:false});
    const[paymentMessage,setPaymentMessage] = useState('');
    const[paymentSucceeded,setPaymentSucceeded] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const{basket} = useAppSelector(state => state.basket);


    const methods = useForm({
        mode:'onTouched',
        resolver: yupResolver(currentForm)
    });

    useEffect(()=>{
        Agent.Account.fetchAddress()
        .then(response =>{
            if(response)
            {
                methods.reset({...methods.getValues(),...response,saveAddress:false})
            }
        })
    },[methods]);

        
    function onCardInputChange(event:any)
    {
      setCardState(
        {
          ...cardState,
          elementError:{
            ...cardState.elementError,
            [event.elementType]:event.error?.message
          }        
        });
    
      setCardComplete({
        ...cardComplete,
        [event.elementType]:event.complete
      });
    };

    function getStepContent(step: number) {
      switch (step) {
          case 0:
              return <AddressForm/>;
          case 1:
              return <Review/>;
          case 2:
              return <PaymentForm cardState={cardState} onCardInputChange={onCardInputChange}/>;
          default:
              throw new Error('Unknown step');
      }
    }

    async function submitOrder(data:FieldValues)
    {
        setLoading(true);
        const{nameOnCard, saveAddress, ...address} = data;
        if(!stripe || !elements) return; // strip is not ready
        try
        {
            const cardElement = elements.getElement(CardNumberElement);
            const paymentResult = await stripe.confirmCardPayment(basket?.clientSecret!,{
                payment_method:{
                    card:cardElement!,
                    billing_details:{
                        name:nameOnCard
                    }
                }
            });
            console.log(paymentResult);
            if(paymentResult.paymentIntent?.status==="succeeded")
            {
                const orederNumber = await Agent.Order.create({saveAddress,address});
                dispatch(clearBasket());
                setOrderNumber(orederNumber);
                setPaymentMessage("Thank you - we have recieved your payment");
                setPaymentSucceeded(true);
                setActiveStep(activeStep + 1);
                setLoading(false);
            }else
            {
                setPaymentSucceeded(false);
                setPaymentMessage(paymentResult.error?.message!);                
                setLoading(false);
                setActiveStep(activeStep + 1);
            }
        }catch(err)
        {
            console.log(err);
            setLoading(false);
        }
    }

    const handleNext = async (data:FieldValues) => 
    {

        if(activeStep === steps.length-1)
        {
           await submitOrder(data);
        }else
        {
            setActiveStep(activeStep + 1);
        }       
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    function submittedDisabled():boolean
    {
        if(steps.length-1 === activeStep)
        {
            return !cardComplete.cardNumber || !cardComplete.cardCvc || !cardComplete.cardExpiry || !methods.formState.isValid;
        }else
        {
            return !methods.formState.isValid;
        }

    };

    return (
        <FormProvider {...methods} >
            <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                <Typography component="h1" variant="h4" align="center">
                    Checkout
                </Typography>
                <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <>
                    {activeStep === steps.length ? (
                        <>
                            <Typography variant="h5" gutterBottom>
                                {paymentMessage}
                            </Typography>
                            {paymentSucceeded ? (
                                <Typography variant="subtitle1">
                                Your order number is #{orderNumber}. We have not emailed your order
                                confirmation, and will not send you an update when your order has
                                shipped, as this a fake store.
                            </Typography>
                            ):(
                                <Button variant="contained" onClick={handleBack}>Go back to previous page</Button>
                            )}
                        </>
                    ) : (
                        <form onSubmit={methods.handleSubmit(handleNext)}>
                            {getStepContent(activeStep)}
                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{mt: 3, ml: 1}}>
                                        Back
                                    </Button>
                                )}
                                <Button loading={loading}
                                    disabled = {submittedDisabled()}
                                    variant="contained"
                                    type="submit"
                                    sx={{mt: 3, ml: 1}}
                                >
                                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                                </Button>
                            </Box>
                        </form>
                    )}
                </>
            </Paper>
        </FormProvider>
    );
}

