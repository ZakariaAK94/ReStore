import List from "@mui/material/List";
import { Badge, Box, IconButton, ListItem, Menu } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";
import DropMenu from "../components/DropMenu";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
import { User } from "../models/user";

interface NavLinkType {
    title: string;
    path: string;
  }
  
interface Props{
    midLinks:NavLinkType[],
    rightLinks:NavLinkType[],
    navStyles:{},
    user:User | null,
    totalQuantity:number
}

export default function DesktopNav({midLinks,rightLinks,navStyles,user,totalQuantity}:Props)
{   
    
     const [anchorEl, setAnchorEl] = useState(null);
    
      const handleClick = (event:any) => {
        setAnchorEl(event.currentTarget); // Open menu on button click
      };
    
      const handleClose = () => {
        setAnchorEl(null); // Close menu when option is clicked or click outside
      };

   return(
        
    <Box sx={navStyles}>
         <IconButton 
             onClick={handleClick} 
             sx={navStyles}
         >
             <MoreVertIcon />
         </IconButton>
         <Menu
             anchorEl={anchorEl}
             open={Boolean(anchorEl)}
             onClose={handleClose}                  
             sx={navStyles}
             
         >
           
                <List>
                {midLinks.map(({title, path})=>(
                    <ListItem
                        component={NavLink}
                        to={path}
                        key={path}
                        sx={navStyles}                                
                        onClick={handleClose}
                    >                               
                        {title.toLocaleUpperCase()}
                    </ListItem>
                ))}
                {user && user.roles?.includes("Admin") &&
                <ListItem
                component={NavLink}
                to={'/inventory'}
                sx={navStyles}
                onClick={handleClose}
                >                            
                    INVENTORY
                </ListItem>
                }
                <IconButton component={Link} to='/basket' size="small" edge="start" color='inherit' sx={{mr:{md:2}, ml:{xs:2,sm:2}}}>
                    <Badge badgeContent={totalQuantity} color="secondary" >
                        <ShoppingCart />
                    </Badge>
                </IconButton>
                {user ? (
                    <DropMenu />
                ):(
                    <List >
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
                )}
                </List>
    </Menu>
    </Box>
    )
}

