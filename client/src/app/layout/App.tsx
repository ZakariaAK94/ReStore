import { Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material"
import Header from "./Header";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../../features/contact/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";

function App() {

  const dispatch = useAppDispatch();
  const[loading, setLoading] = useState(true);

  const initApp = useCallback(async ()=>
  {
    try{
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    }catch(error:any)
    {
      console.log(error);
    }
  },[dispatch]);

 useEffect(()=>{
  initApp().then(()=>setLoading(false));
 },[initApp])


  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark':'light';
  const theme = createTheme(
    { palette : {
      mode:paletteType,
      background:{ default: paletteType === "light" ? "#eaeaea" : "#121212" }
             } }
  );

  function handleSwitchMode()
  {
    setDarkMode(pre=>!pre)
  }

  if(loading) return <LoadingComponent message="Initializing app..." />

  return (
  
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header handleSwitchMode={handleSwitchMode} darkMode={darkMode}/>
        <Container>          
            <Outlet  />
        </Container>
       <ToastContainer position="bottom-right" closeOnClick={true} theme="colored" style={{ zIndex: 9999 }} />
    </ThemeProvider>    
  )
}

export default App;
