import List from "@mui/material/List";
import { Badge, Box, IconButton, ListItem } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";
import DropMenu from "../components/DropMenu";
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
   return(  

      <>
        <Box  >
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
                              {user && user.roles?.includes("Admin") &&
                              <>
                              <ListItem
                              component={NavLink}
                              to={'/inventory'}
                              sx={navStyles}
                              >
                                  INVENTORY
                              </ListItem>
                               <ListItem
                               component={NavLink}
                               to={'/errortestpage'}
                               sx={navStyles}
                               >
                                   ErrorTestPage
                               </ListItem>
                              </>
                              }
                          </List>
                      </Box>
      
                      <Box display='flex' alignItems='center'>
                          <IconButton component={Link} to='/basket' size="small" edge="start" color='inherit' sx={{mr:2}}>
                              <Badge badgeContent={totalQuantity} color="secondary">
                                  <ShoppingCart />
                              </Badge>
                          </IconButton>
                          {user ? (
                              <DropMenu />
                          ):(
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
                          )}
                      </Box>
      </>
    
    
    )
}

