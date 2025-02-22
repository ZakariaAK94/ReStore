import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props{
    handleSwitchMode: ()=>void;
    darkMode: boolean
}

export default function Header({darkMode,handleSwitchMode}:Props)
{
    return(
        <AppBar position="static" sx={{mb:4}}>
            <Toolbar >
                <Typography variant="h5"  >
                    RE-STORE
                </Typography>
                <Switch checked={darkMode} onChange={handleSwitchMode} />
            </Toolbar>
        </AppBar>
    )
}