import List from "@mui/material/List";
import { AppBar, Badge, Box, IconButton, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";

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
                    <IconButton size="small" edge="start" color='inherit' sx={{mr:2}}>
                        <Badge badgeContent='4' color="secondary">
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