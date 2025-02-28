import { Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material"
import Header from "./Header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useStoreContext } from "../Context/StoreContext";
import { getCookie } from "../util/util";
import Agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {

  const{setBasket} = useStoreContext();
  const[loading, setLoading] = useState(true);

 useEffect(()=>{
  const buyerId = getCookie("buyerId");
  if(buyerId)
  {
    Agent.Basket.get()
      .then(basket => setBasket(basket))
      .catch(err => console.log(err))
      .finally(()=>setLoading(false));
  }else
  {
    setLoading(false);
  }
 },[setBasket])


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
