import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAppDispatch, useAppSelector } from '../../features/contact/configureStore';
import { SiginOut } from '../../features/account/accountSlice';
import { clearBasket } from '../../features/basket/basketSlice';
import { Link } from 'react-router-dom';

export default function DropMenu() {

  const {user} = useAppSelector(state=>state.account);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };



  return (
    <div>
      <Button onClick={handleClick} color='inherit'>
        {user?.email}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem component={Link} to='/profile'>Profile</MenuItem>
        <MenuItem component={Link} to='/orders'>My orders</MenuItem>
        <MenuItem onClick={()=>{
          dispatch(SiginOut());
          dispatch(clearBasket())
        }
        }>Logout</MenuItem>
      </Menu>
    </div>
  );
}