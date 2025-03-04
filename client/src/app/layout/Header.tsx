import List from "@mui/material/List";
import { AppBar, Badge, Box, IconButton, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";
import { useStoreContext } from "../Context/StoreContext";
import { useAppSelector } from "../../features/contact/configureStore";

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

export default function Header({darkMode,handleSwitchMode}:Props)
{
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
        <AppBar position="static" sx={{mb:4}}>
            <Toolbar sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}} >

                <Box display='flex' alignItems='center'>
                    <Typography variant="h5" component={NavLink} to='/' sx={navStyles} >
                        RE-STORE
                    </Typography>
                    <Switch checked={darkMode} onChange={handleSwitchMode} />
                </Box>

                <Box>
                    <List sx={{ display: "flex" }}>
                        {midLinks.map(({title, path})=>(
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navStyles}
                            >
                                {title.toLocaleUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='/basket' size="small" edge="start" color='inherit' sx={{mr:2}}>
                        <Badge badgeContent={totalQuantity} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    <List sx={{ display: "flex" }}>
                        {rightLinks.map(({title, path})=>(
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navStyles}
                            >
                                {title.toLocaleUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Toolbar>
        </AppBar>
    )
}