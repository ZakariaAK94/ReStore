import { Typography, TextField } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AppTextInput from "../../../app/components/AppTextInput";
import { useFormContext } from "react-hook-form";
import { CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import StripeInput from "../StripeInput";
import { StripeElementType } from "@stripe/stripe-js";

interface Props
{
  cardState:{elementError:{[key in StripeElementType]?:string}};
  onCardInputChange:(event:any)=>void;
}

export default function PaymentForm({cardState, onCardInputChange}:Props) {
  const{control} = useFormContext();
 


  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid size={6}>
          <AppTextInput control={control} name="nameOnCard" label="Name on Card" />
        </Grid>
        <Grid size={6}>
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardNumber}
            helperText={cardState.elementError.cardNumber}
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            variant="outlined"
            aria-hidden={false}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                inputComponent: StripeInput,
                inputProps: {
                  component: CardNumberElement
                },
              },
            }}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardExpiry}
            helperText={cardState.elementError.cardExpiry}
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            variant="outlined"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                inputComponent: StripeInput,
                inputProps: {
                  component: CardExpiryElement
                },
              },
            }}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardCvc}
            helperText={cardState.elementError.cardCvc}
            id="cvv"
            label="CVV"
            fullWidth
            autoComplete="cc-csc"
            variant="outlined"
            aria-hidden={false}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                inputComponent: StripeInput,
                inputProps: {
                  component: CardCvcElement
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}