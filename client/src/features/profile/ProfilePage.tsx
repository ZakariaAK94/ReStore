import {Box, Container, Divider, Typography} from '@mui/material';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';
import { useAppSelector } from '../contact/configureStore';
import DeleteProfile from './DeleteProfile';

const ProfilePage = () => {   
  const {user} = useAppSelector(state=>state.account);

  return (
    <Container maxWidth="sm">
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "500px",
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }} >

        <Typography variant="h4" gutterBottom mt={4} >
          Profile
        </Typography>
        
        <EditProfile user={user}/>

        <Divider sx={{ my: 4, bgcolor:'blue' }} />

        <ChangePassword />

        <Divider sx={{ my: 4, bgcolor:'blue' }} />

        {!user?.roles?.includes('Admin') && (
        <DeleteProfile />
)}
        
      </Box>
    </Container>
  );
};

export default ProfilePage;
