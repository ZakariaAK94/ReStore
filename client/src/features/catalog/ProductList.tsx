import { Product } from "../../app/models/Product";
import ProductCard from "./ProductCard";
import { Box } from "@mui/material";


interface Props{
    products:Product[]
}
export default function ProductList({products}:Props)
{
    return(        
            <Box
                display="grid"
                gridTemplateColumns={{
                    xs: "1fr",          // 1 column on extra-small screens
                    sm: "repeat(2, 1fr)", // 2 columns on small screens
                    md: "repeat(3, 1fr)", // 3 columns on medium screens and up
                }}
                gap={3} 
                justifyContent="center"                
                >
                {products.map((product) => (
                    <Box key={product.id} sx={{border: "1px solid #ddd", borderRadius: 2 }}>
                        <ProductCard product={product} />
                    </Box>
                    ))}
            </Box>
    
    )
}



