import { Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../../app/components/AppTextInput";
import AppCheckBox from "../../../app/components/AppCheckBox";

export default function AddressForm() {
  const {control, formState} = useFormContext();
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
         <Grid size={12}>
          <AppTextInput control={control} name="fullName" label="Full Name"  />          
        </Grid>
        <Grid size={12}>
          <AppTextInput control={control} name="address1" label="Address1"  />
        </Grid>  
        <Grid size={12}>
          <AppTextInput control={control} name="address2" label="Address2"  />
        </Grid>
        <Grid size={6}>
            <AppTextInput control={control} name="city" label="City"  />
        </Grid>
        <Grid size={6}>
           <AppTextInput control={control} name="state" label="State"  />
        </Grid>
        <Grid size={6}>
             <AppTextInput control={control} name="zip" label="Zip"  />
        </Grid>
        <Grid size={6}>
             <AppTextInput control={control} name="country" label="Country"  />
        </Grid>
        <Grid size={12}>
          <AppCheckBox 
            disabled={!formState.isDirty}
            name="saveAddress" 
            label="Save this address as default address"            
            control={control} />
        </Grid>
      </Grid>
    </>
  );
}