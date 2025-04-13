import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../../features/contact/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import HomePage from "../../features/home/HomePage";
import HeaderTest from "./HeaderTest";

function App() {

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error: any) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp])


  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme(
    {
      palette: {
        mode: paletteType,
        background: { default: paletteType === "light" ? "#eaeaea" : "#121212" }
      }
    }
  );

  function handleSwitchMode() {
    setDarkMode(pre => !pre)
  }


  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HeaderTest handleSwitchMode={handleSwitchMode} darkMode={darkMode} />
      {loading ? <LoadingComponent message="Initializing app..." />
        : location.pathname === "/" ? <HomePage />
          : <Container sx={{mt:4}}>
              <Outlet />
            </Container>
      }
      <ToastContainer position="bottom-right" closeOnClick={true} theme="colored" style={{ zIndex: 9999 }} />
    </ThemeProvider>
  )
}

export default App;
