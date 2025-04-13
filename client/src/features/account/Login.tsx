import {
  Box,
  Button,
  Divider,
  FormLabel,
  FormControl,
  TextField,
  Typography,
  Container,
  Avatar,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import { useAppDispatch } from "../contact/configureStore";
import { signInUser } from "./accountSlice";

export default function Login() {
  const location = useLocation();
  const from = location.state?.from || '/catalog'; // fallback route
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState:{isSubmitting,isValid, errors} } = useForm({
      defaultValues:{
        username:'',
        password:''
      },
      mode:'onTouched'
    });

    async function SubmitForm(data:FieldValues)
    {
       try{
        await dispatch(signInUser(data));        
        navigate(from);
      }catch(error)
      {     
        console.log(error);
      }
    }


  return (
    <Container
      sx={{
        display: "flex",
        justifyContent:"center",
        alignItems:'center',
        p:4
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "500px",
          width: "100%",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Avatar>
              <LockOutlined color="primary" />
           </Avatar>
        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>           
          Sign in
        </Typography>

        <Box component="form" onSubmit={handleSubmit(SubmitForm)} noValidate sx={{ width: "100%" }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Username</FormLabel>
            <TextField
              type="text"
              required
              autoFocus
              {...register('username',{required:'username is required'})}
              error={!!errors.username}
              helperText={errors?.username?.message as string}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Password</FormLabel>
            <TextField
              placeholder="••••••"
              type="password"
              required
              {...register('password',{required:'password is required'})}
              error={!!errors.password?.message}
              helperText={errors?.password?.message as string}
            />
          </FormControl>

          <Button 
            disabled={!isValid}
            type="submit" 
            loading={isSubmitting} 
            fullWidth variant="contained" 
            sx={{ mt: 2, p:1 }}>
              Sign in
          </Button>
        </Box>

        <Divider sx={{ my: 2, width: "100%" }}>or</Divider>

        <Typography>
          Don&apos;t have an account?{" "}
          <Link to="/register" color="secondary" state={{from}}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
