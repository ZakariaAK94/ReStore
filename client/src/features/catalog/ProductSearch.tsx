import { debounce, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../contact/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch()
{
    const {productParams} = useAppSelector(state=> state.catalog);
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

    const debouncedSearch = debounce((event:any)=>{
        dispatch(setProductParams({searchTerm:event.target.value}))
    },1000);

    return(
        <TextField  
                label="Search"
                variant="outlined" 
                value={searchTerm || ''} 
                fullWidth
                onChange={(event:any)=>{
                    setSearchTerm(event.target.value);
                    debouncedSearch(event);
                }}
            /> 
    )
}