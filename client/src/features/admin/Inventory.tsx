import { Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { currencyFormat } from "../../app/util/util";
import useProducts from "../../app/hooks/useProducts";
import AppPagination from "../../app/components/AppPagination";
import { removeProduct, setPageNumber } from "../catalog/catalogSlice";
import { useState } from "react";
import ProductForm from "./ProductForm";
import { Product } from "../../app/models/Product";
import Agent from "../../app/api/agent";

export default function Inventory() {
    const {products, metaData, dispatch} = useProducts();
    const[editMode, setEditMode] = useState(false);
    const[selectedProduct,setSelectedProduct] = useState<Product | undefined>(undefined);
    const [target, setTarget] = useState(0);
    const[loading, setLoading] = useState(false);

    function handleEditChange(product:Product)
    {
        setSelectedProduct(product);
        setEditMode(true);
    }

    function handleCancelClick()
    {
        setEditMode(false);
        if(selectedProduct) setSelectedProduct(undefined);
    }

    async function handleDeleteClick(id:number)
    {
        setLoading(true)
        await Agent.Admin.delete(id)
        .then(()=>{
            dispatch(removeProduct(id))
        })
        .catch(err => console.log(err))
        .finally(()=>setLoading(false));

    }

    if(editMode) return <ProductForm product={selectedProduct} cancel={handleCancelClick} />

    return (
        <>
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} variant='h4'>Inventory</Typography>
                <Button onClick={()=>setEditMode(true)} sx={{ m: 2 }} size='large' variant='contained'>Create</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Brand</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow
                                key={product.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {product.id}
                                </TableCell>
                                <TableCell align="left">
                                    <Box display='flex' alignItems='center'>
                                        <img src={product.pictureUrl} alt={product.name} style={{ height: 50, marginRight: 20 }} />
                                        <span>{product.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">{currencyFormat(product.price)}</TableCell>
                                <TableCell align="center">{product.type}</TableCell>
                                <TableCell align="center">{product.brand}</TableCell>
                                <TableCell align="center">{product.quantityInStock}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={()=>handleEditChange(product)} startIcon={<Edit />} />
                                    <Button 
                                    loading={target===product.id && loading}
                                    onClick={()=>{
                                        handleDeleteClick(product.id);
                                        setTarget(product.id)
                                    }} 
                                    startIcon={<Delete />} color='error' />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {metaData &&
            <AppPagination metaData={metaData} onPageChange={(page:number)=>dispatch(setPageNumber({pageNumber: page}))} />
            }
        </>
    )
}