import {  Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/Product";
import { Link } from "react-router-dom";
import { currencyFormat } from "../../app/util/util";
import { useAppDispatch, useAppSelector } from "../contact/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";

interface Props {
    product: Product
}
export default function ProductCard({product}:Props)
{
    const {status}=useAppSelector(state => state.basket)
    const dispatch = useAppDispatch();

    return(
        <Card sx={{maxWidth:250, minWidth:200}}>
            <CardHeader 
                avatar={
                    <Avatar sx={{bgcolor:'secondary.main'}}>
                        {product.name.charAt(0).toLocaleUpperCase()}
                    </Avatar>
                }
                title={product.name}
                sx={{"& .MuiCardHeader-title":{fontWeight:'bold', color:'primary.main'}}}
                
            />
            <CardMedia sx={{ height: 140, backgroundSize:'contain', bgcolor:'primary.light' }} image={product.pictureUrl} title={product.name} />
            <CardContent>
                    <Typography gutterBottom color="secondary" variant="h5">                       
                       {currencyFormat(product.price)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {product.brand} / {product.type}
                    </Typography>
            </CardContent>
            <CardActions>
                    <Button 
                    loading={status === 'pendingAddItem'+product.id}
                    onClick={()=>dispatch(addBasketItemAsync({productId:product.id, quantity:1}))}
                    size="small">
                        ADD TO CART
                    </Button>
                    <Button size="small" component={Link} to={`/catalog/${product.id}`}>VIEW</Button>
            </CardActions>
      </Card>
    )
}