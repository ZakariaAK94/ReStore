import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";
import { useState } from "react";

interface Props{
    metaData: MetaData;
    onPageChange : (page:number)=>void;
}

export default function AppPagination({metaData, onPageChange}:Props)
{
    const {currentPage, totalPage, totalCount, pageSize } = metaData;
    const [pageNumber, setPageNumber] = useState(currentPage);

    function handlePageChange(page:number)
    {
        setPageNumber(page);
        onPageChange(page);
    }
    
    return(
        <Box 
            display='flex' 
            justifyContent='space-between' 
            alignItems='center' 
            sx={{p:4, flexDirection:{xs:'column',sm:'row',md:'row'}}}>
             <Typography>
                   Displaying {pageSize*(currentPage-1)+1} -
                   {pageSize*currentPage > totalCount ? totalCount : pageSize*currentPage} of {totalCount} items
               </Typography>
              <Pagination 
                    count={totalPage} 
                    page={pageNumber} 
                    color="secondary" 
                    onChange={(e,page)=>handlePageChange(page)}
                />
           </Box>
    );
}