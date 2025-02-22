import {  Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/Product";
import { Link } from "react-router-dom";

interface Props {
    product: Product
}
export default function ProductCard({product}:Props)
{
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
                        ${(product.price/100).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {product.brand} / {product.type}
                    </Typography>
            </CardContent>
            <CardActions>
                    <Button size="small">ADD TO CART</Button>
                    <Button size="small" component={Link} to={`/catalog/${product.id}`}>VIEW</Button>
            </CardActions>
      </Card>
    )
}