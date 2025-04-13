import { AppBar, Box, Switch, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../features/contact/configureStore";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const midLinks = [
    {title:'catalog', path:'/catalog'},
    {title:'about', path:'/about'},
    {title:'contact', path:'/contact'},
];

const rightLinks = [
    {title:'login', path:'/login'},
    {title:'register', path:'/register'}
];

interface Props{
    handleSwitchMode: ()=>void;
    darkMode: boolean
}

export default function HeaderTest({darkMode,handleSwitchMode}:Props)
{
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {user} = useAppSelector(state=>state.account); 
    const navStyles = {
        color:'inherit', 
        textDecoration:'none',
        typography:'h6',
        "&:hover":{color:'grey.500'},
        "&.active":{color:'text.secondary'}
    }

    const {basket} = useAppSelector(state=>state.basket);
    const totalQuantity = basket===null ? 0 : basket.items.reduce((sum,item)=>{
              return sum = sum + item.quantity;
    },0);



    return(
        <AppBar position="static" sx={{width:"100%"}}>
            <Toolbar sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}} >
                <Box
                    display='flex' 
                    alignItems='center' 
                 >
                    <Typography variant="h5" component={NavLink} to='/' sx={navStyles} >
                        RE-STORE
                    </Typography>
                    <Switch checked={darkMode} onChange={handleSwitchMode} />
                </Box>               

                 {
                 isMobile 
                 ? <MobileNav 
                      user={user} 
                      totalQuantity={totalQuantity} 
                      midLinks={midLinks} 
                      rightLinks={rightLinks} 
                      navStyles={navStyles} /> 
                 : <DesktopNav 
                      user={user} 
                      totalQuantity={totalQuantity} 
                      midLinks={midLinks} 
                      rightLinks={rightLinks} 
                      navStyles={navStyles} />
                 }
                 

            </Toolbar>
        </AppBar>
    )
}

