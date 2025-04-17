import {Typography,TextField,Box,FormControl, FormLabel, Button} from '@mui/material';
import Agent from '../../app/api/agent';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../contact/configureStore';
import { SiginOut } from '../account/accountSlice';
import { FieldValues, useForm } from 'react-hook-form';
import { User } from '../../app/models/user';

interface Props{
  user:User | null
}
export default function EditProfile({user}:Props)
{
  const dispatch = useAppDispatch();  
  const { register, handleSubmit, setError, formState:{isSubmitting, isValid, errors, isDirty} } = useForm({
        defaultValues:{
          username:user?.userName,
          currentPassword:'',
          email:user?.email
        },
        mode:'onTouched'
      });

    function handleApiErrors(errors:any)
    {
      if (Array.isArray(errors)) {
        errors.forEach((error: string) => {
          if (error.includes("currentPassword")) {
            setError("currentPassword", { message: error });
          } else if (error.includes("email")) {
            setError("email", { message: error });
          } else if (error.includes("username")) {
            setError("username", { message: error });
          }
        });
      } else {
        console.error("API error format is not an array:", errors);
      }
      
    }

  const handleProfileSubmit = (data:FieldValues) => {
    if (data.username === user?.userName && data.email === user?.email) 
    {
        toast.info("No changes detected.");
        return Promise.resolve(); 
    }
    return Agent.Account.editProfile(data)
    .then(() => {
      toast.success('Profile updated. Please log in again.');       
      setTimeout(() => { dispatch(SiginOut());}, 2000);
    })
    .catch(err => handleApiErrors(err));
    
  };

  return (    

      <Box component="form" 
             onSubmit={handleSubmit(data => handleProfileSubmit(data))} 
             noValidate sx={{ width: "100%" }} >
          <Typography variant="h6" sx={{mb:2}}>Edit Profile</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Username</FormLabel>
            <TextField
              type="text"
              required
              {...register('username',{required:'username is required'})}
              error={!!errors.username}
              helperText={errors?.username?.message as string}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Email</FormLabel>
            <TextField
              type="email"
              required
              {...register('email',{required:'Email is required',
                pattern:{
                  value:/^[\w.=-]+@[\w.-]+\.[\w]{2,3}$/,
                  message:"Not a valid email"
                }})}
              error={!!errors.email}
              helperText={errors?.email?.message as string}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Current Password</FormLabel>
            <TextField
              placeholder="••••••"
              type="password"
              required
              {...register('currentPassword',{
                required:'current password is required',
                })}
              error={!!errors.currentPassword?.message}
              helperText={errors?.currentPassword?.message as string}
            />
          </FormControl>          

          <Button 
            disabled={!isValid || !isDirty}
            type="submit" 
            loading={isSubmitting} 
            fullWidth 
            variant="contained" 
            sx={{ mt: 2, p:1 }}>
              Edit profile
          </Button>
        </Box>

  );
};

