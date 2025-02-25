import { Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material"
import Header from "./Header";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark':'light'
  const theme = createTheme(
    { palette : {
      mode:paletteType,
      background:{
        default: paletteType === "light" ? "#eaeaea" : "#121212"
      }
    } }
  );
 
  function handleSwitchMode()
  {
    setDarkMode(pre=>!pre)
  }

  return (
  
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar closeOnClick={true} theme="colored" />
        <CssBaseline />
        <Header handleSwitchMode={handleSwitchMode} darkMode={darkMode}/>
        <Container>          
            <Outlet  />
        </Container>
    </ThemeProvider>    
  )
}

export default App;
