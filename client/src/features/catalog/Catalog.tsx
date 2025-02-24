import { Product } from "../../app/models/Product"
import { Box} from "@mui/material";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";
import Agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";


export default function Catalog()
{
    
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
    Agent.Catalog.list()
    .then(products => setProducts(products))
    .catch(err => console.log(err.message))
    .finally(()=>setLoading(false));
    },[]);

    if(loading) return <LoadingComponent message='Loading products...' />
    return(
        <>  
         <Box display="flex" justifyContent="center" >
              <ProductList products={products}/>
         </Box>     
        </>
    )
}