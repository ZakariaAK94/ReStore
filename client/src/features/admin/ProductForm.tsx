import { Typography, Paper, Box, Button} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import { Product } from "../../app/models/Product";
import { useEffect } from "react";
import AppSelectList from "../../app/components/AppSelectList";
import useProducts from "../../app/hooks/useProducts";
import AppDropZone from "../../app/components/AppDropZone";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./ProductValidaion";
import Agent from "../../app/api/agent";
import { setProduct } from "../catalog/catalogSlice";


interface Props {
    product?:Product,
    cancel:()=>void
}

export default function ProductForm({product, cancel}:Props) {
    const { control, reset, handleSubmit, watch, formState:{isDirty, isSubmitting} } = useForm({
        resolver:yupResolver<any>(validationSchema)
    });
    const {brands, types, dispatch} = useProducts();

    const watchFile = watch('file',null);
   
    useEffect(()=>{
        if(product && !watchFile && !isDirty) reset(product);

        return ()=>{
            if(watchFile) URL.revokeObjectURL(watchFile.preview);
        }
    },[product, reset, watchFile, isDirty]);

    async function handleSumbitData(data:FieldValues)
    {
        let response;
        try {
            if(product)
            {
                 response = await Agent.Admin.updateProduct(data);
            }else
            {
                response = await Agent.Admin.createProduct(data);
            }

            dispatch(setProduct(response.data));
            cancel();
            
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Box component={Paper} sx={{p: 4}}>
            <Typography variant="h4" gutterBottom sx={{mb: 4}}>
                Product Details
            </Typography>
            <form onSubmit={handleSubmit(handleSumbitData)}>
            <Grid container spacing={3}>
                <Grid size={{xs:12, sm:12}}>
                    <AppTextInput control={control} name='name' label='Product name' />
                </Grid>
                <Grid size={{xs:12, sm:6}} >
                    <AppSelectList control={control} name='brand' label='Brand' items={brands} />
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <AppSelectList control={control} name='type' label='Type' items={types}/>
                </Grid>
                <Grid size={{xs:12, sm:6}} >
                    <AppTextInput control={control} name='price' label='Price' type='number' />
                </Grid>
                <Grid size={{xs:12, sm:6}} >
                    <AppTextInput control={control} name='quantityInStock' label='Quantity in Stock' type='number' />
                </Grid>
                <Grid size={{xs:12}} >
                    <AppTextInput control={control} name='description' label='Description' multiline={true} rows={3}/>
                </Grid>
                <Grid size={{xs:12}} >
                    <Box display={"flex"} justifyContent='space-between' alignItems='center' >
                        <AppDropZone control={control} name='file' />
                        {watchFile ? (
                            <img src={watchFile.preview} alt="preview" style={{maxHeight:200}} />
                        ):(
                            <img src={product?.pictureUrl} alt={product?.name} style={{maxHeight:200}}/>
                        )}
                    </Box>
                </Grid>
            </Grid>
            <Box display='flex' justifyContent='space-between' sx={{mt: 3}}>
                <Button onClick={cancel} variant='contained' color='inherit'>Cancel</Button>
                <Button loading={isSubmitting} type='submit' variant='contained' color='success'>Submit</Button>
            </Box>
            </form>
        </Box>
    )
}