import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../contact/configureStore';
import { SiginOut } from '../account/accountSlice';
import Agent from '../../app/api/agent';

export default function EditProfile() {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const[isLoading,setIsLoading] = useState(false);
 

  const handleDeleteConfirm = () => {
    setIsLoading(true);
    Agent.Account.deleteAccount({ currentPassword })
      .then(() => {
        toast.success('Account deleted successfully.');
        dispatch(SiginOut());
      })
      .catch((err) => {
        toast.error('Failed to delete account.');
        console.error(err);
      })
      .finally(() => {setOpen(false); setIsLoading(false);}); 
  };

  return (
    <div>
      
      <Button onClick={() => setOpen(true)} color="error" variant="outlined">
        Delete Account
      </Button>

      <Dialog open={open} onClose={ () => setOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>

          <TextField
            type="password"
            label="Current Password"
            fullWidth
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)} 
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" loading={isLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
