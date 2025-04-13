import { Product } from "../../app/models/Product";
import { useAppSelector } from "../contact/configureStore";
import ProductCard from "./ProductCard";
import { Box } from "@mui/material";
import ProductCardSkeleton from "./ProductCardSkeleton";


interface Props{
    products:Product[]
}
export default function ProductList({products}:Props)
{
    
    const {loadingProduct} = useAppSelector(state => state.catalog);
    return(        
            <Box
                display="grid"
                gridTemplateColumns={{
                    xs: "1fr",         
                    sm: "repeat(2, 1fr)", 
                    md: "repeat(3, 1fr)", 
                }}
                gap={3}                 
                >
                {products.map((product) => (
                    <Box key={product.id} sx={{borderRadius: 2 }}>
                       {
                       !loadingProduct ? (<ProductCardSkeleton />) 
                                        : (<ProductCard product={product} />)
                       }
                    </Box>
                    ))}
            </Box>
    
    )
}



