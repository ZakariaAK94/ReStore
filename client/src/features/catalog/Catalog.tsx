import { Box} from "@mui/material";
import ProductList from "./ProductList";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../contact/configureStore";
import { fetchProductsAsync, productSelector } from "./catalogSlice";
import { useEffect } from "react";


export default function Catalog()
{    
    const products = useAppSelector(productSelector.selectAll);
    const dispatch = useAppDispatch();
    const {loadingProduct, status} = useAppSelector(state => state.catalog);

    useEffect(()=>{
    if(!loadingProduct) dispatch(fetchProductsAsync());
    },[loadingProduct,dispatch]);

    if(status.includes("pending")) return <LoadingComponent message='Loading products...' />
    return(
        <>  
         <Box display="flex" justifyContent="center" >
              <ProductList products={products}/>
         </Box>     
        </>
    )
}