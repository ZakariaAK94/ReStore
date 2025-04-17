import {Typography,TextField,Button,Box,FormControl, FormLabel} from '@mui/material';
import Agent from '../../app/api/agent';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../contact/configureStore';
import { SiginOut } from '../account/accountSlice';
import { FieldValues, useForm } from 'react-hook-form';

export default function ChangePassword() 
{  
  const dispatch = useAppDispatch();
  const { register, handleSubmit, setError, watch, formState:{isSubmitting,isValid, errors} } = useForm({
        defaultValues:{
          oldPassword:'',
          newPassword:'',
          confirmPassword:''
        },
        mode:'onTouched'
      });
  
 const newPassword = watch('newPassword');
 const oldPassword = watch('oldPassword');

    function handleApiErrors(errors:any)
    {
      if(errors)
      {
        errors.forEach((error:string) => {
            if(error.includes("oldPassword"))
            {
              setError("oldPassword",{message:error})
            }else  if(error.includes("newPassword"))
            {
                setError("newPassword",{message:error})
            }else  if(error.includes("confirmPassword"))
            {
                setError("confirmPassword",{message:error})
            }
        });
      }
      
    }

    function checkIfPasswordIsDifferentWithThreeCharacter(newpassword:string, oldpassword:string):boolean
    {
      let counter = 0;
      const difference = Math.abs(newPassword.length-oldPassword.length)
      if(difference>=3)
        return true;
      const minsize = Math.min(newPassword.length,oldPassword.length)
      counter = difference;
      for(let i=0; i<minsize;i++)
      {
        if(oldPassword[i] !==newpassword[i])
        {
          counter++;
          if(counter>=3)
            return true;
        }
      }

      return false;
    }

  const handlePasswordSubmit = (data:FieldValues) => {
    const {oldPassword, newPassword} = data;
    return Agent.Account.changePassword({oldPassword, newPassword})
      .then(() => {
        toast.success('Password updated successfully. Please log in again.');
        setTimeout(() => { dispatch(SiginOut())}, 2000);
      })
      .catch(err => handleApiErrors(err));
  };

  return (

      <Box component="form" 
             onSubmit={handleSubmit(data => handlePasswordSubmit(data))} 
             noValidate sx={{ width: "100%" }}>
          <Typography variant="h6" sx={{mb:2}}>Change Password</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Old Password</FormLabel>
            <TextField
              type="password"
              placeholder="••••••"
              required
              {...register('oldPassword',{required:'oldPassword is required'})}
              error={!!errors.oldPassword}
              helperText={errors?.oldPassword?.message as string}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>New Password</FormLabel>
            <TextField
              type="password"
              placeholder="••••••"
              required
              {...register('newPassword',{
                required:'newPassword is required',
                validate: (value) =>
                  checkIfPasswordIsDifferentWithThreeCharacter(value, oldPassword) || "Password must differ by at least 3 characters from old password",              
                pattern:{
                  value:/(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/,
                  message:"Password must contain at least 8 characters, an uppercase letter, a number"
                }})}
              error={!!errors.newPassword}
              helperText={errors?.newPassword?.message as string}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Confirm Password</FormLabel>
            <TextField
              placeholder="••••••"
              type="password"
              required
              {...register('confirmPassword',{
                required:'confirm password is required',
                validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
              error={!!errors.confirmPassword?.message}
              helperText={errors?.confirmPassword?.message as string}
            />
          </FormControl>          

          <Button 
            disabled={!isValid}
            type="submit" 
            loading={isSubmitting} 
            fullWidth 
            variant="contained" 
            sx={{ mt: 2, p:1 }}>
              Change Password
          </Button>
        </Box>

     
  );
};


