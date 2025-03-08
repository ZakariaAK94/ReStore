import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";

interface Props{
    metaData: MetaData;
    onPageChange : (page:number)=>void;
}

export default function AppPagination({metaData, onPageChange}:Props)
{
    const {currentPage, totalPage, totalCount, pageSize } = metaData;
    
    return(
        <Box display='flex' justifyContent='space-between' alignItems='center' sx={{p:4}}>
             <Typography>
                   Displaying {pageSize*(currentPage-1)+1} -
                   {pageSize*currentPage > totalCount ? totalCount : pageSize*currentPage} of {totalCount} items
               </Typography>
              <Pagination 
                    count={totalPage} 
                    page={currentPage} 
                    color="secondary" 
                    onChange={(e,page)=>onPageChange(page)}
                />
           </Box>
    );
}