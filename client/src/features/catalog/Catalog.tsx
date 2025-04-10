import { Box, Paper} from "@mui/material";
import ProductList from "./ProductList";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppSelector } from "../contact/configureStore";
import { setPageNumber, setProductParams } from "./catalogSlice";
import ProductSearch from "./ProductSearch";
import RadioButtonsGroup from "../../app/components/RadioButtonsGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";
import AppPagination from "../../app/components/AppPagination";
import useProducts from "../../app/hooks/useProducts";

const SortedOptions = [
    {value:'name', label:'Alhpabetical'},
    {value:'priceDesc', label:'Price - Hight to Low'},
    {value:'price', label:'Price - Low to Hight'},
]

export default function Catalog()
{    
    const {products, filterLoading,brands,types,metaData,dispatch} = useProducts();
    const {productParams} = useAppSelector(state => state.catalog);


    if(!filterLoading ) return <LoadingComponent message='Loading products...' />
    
    return(        
        <Box 
            display="grid" 
            gridTemplateColumns={{
                md: "3fr 9fr" 
            }} 
            gap={6}
         >          
            <Box>
                <Paper sx={{mb:2}}>
                    <ProductSearch />                   
                </Paper>
                <Paper sx={{mb:2, p:2}}>
                    <RadioButtonsGroup
                     options ={SortedOptions}
                     selectedValue={productParams.orderBy}
                     onChange={(e:any)=> dispatch(setProductParams({orderBy:e.target.value}))}
                    />                  
                </Paper>
                <Paper sx={{mb:2, p:2}}>
                    <CheckBoxButtons
                        items={brands}
                        checked = {productParams.brands}
                        onChange={(items:string[])=>dispatch(setProductParams({brands:items}))}
                    />
                </Paper>
                <Paper sx={{mb:2, p:2}}>
                     <CheckBoxButtons
                        items={types}
                        checked = {productParams.types}
                        onChange={(items:string[])=>dispatch(setProductParams({types:items}))}
                      />
                </Paper>
            </Box>
            <Box display="flex" flexDirection="column" minHeight="100vh">
                <ProductList products={products} />
                <Box sx={{ marginTop: "auto" }}>  
                   { metaData &&
                    <AppPagination 
                        metaData={metaData}
                        onPageChange={(page:number) => dispatch(setPageNumber({pageNumber: page}))}
                    />}
                </Box>
            </Box>
        </Box>            
    )
}