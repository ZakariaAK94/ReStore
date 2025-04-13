import { Box, Button, Divider, FormLabel, FormControl, TextField, Typography, Container, Avatar} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import Agent from "../../app/api/agent";
import { toast } from "react-toastify";

export default function Register() {
  const location = useLocation();
  const from = location.state?.from || '/catalog'; // fallback route
  const navigate = useNavigate();
   const { register, handleSubmit, setError, formState:{isSubmitting,isValid, errors} } = useForm({
      defaultValues:{
        username:'',
        password:'',
        email:''
      },
      mode:'onTouched'
    });

    function handleApiErrors(errors:any)
    {
      if(errors)
      {
        errors.forEach((error:string) => {
            if(error.includes("Password"))
            {
              setError("password",{message:error})
            }else  if(error.includes("Email"))
            {
                setError("email",{message:error})
            }else if(error.includes("Username"))
              {
                setError("username",{message:error})
              }
        });
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
          maxWidth: "550px",
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
          Register
        </Typography>

        <Box component="form" 
             onSubmit={handleSubmit(data => Agent.Account.register(data)
                          .then(()=>{
                            toast.success("Registration successful - you can now login");
                            navigate("/login",{state:{from}})
                          })
                          .catch(err => handleApiErrors(err)))} 
             noValidate sx={{ width: "100%" }}>
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
            <FormLabel>Email</FormLabel>
            <TextField
              type="email"
              required
              {...register('email',{
                required:'Email is required',
                pattern:{
                  value:/^[\w.=-]+@[\w.-]+\.[\w]{2,3}$/,
                  message:"Not a valid email"
                }})}
              error={!!errors.email}
              helperText={errors?.email?.message as string}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Password</FormLabel>
            <TextField
              placeholder="••••••"
              type="password"
              required
              {...register('password',{
                required:'password is required',
                pattern:{
                  value:/(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/,
                  message:"Password must contain at least 8 characters, an uppercase letter, a number"

                }})}
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
              Register
          </Button>
        </Box>

        <Divider sx={{ my: 2, width: "100%" }}>or</Divider>

        <Typography>
          Already have an account?{" "}
          <Link to="/login" color="secondary">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
