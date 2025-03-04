import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/Product";
import Agent from "../../app/api/agent";
import { RootState } from "../contact/configureStore";

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async(_,thunkAPI)=>{
        try{
            return await Agent.Catalog.list();
        }catch(error:any)
        {
            return thunkAPI.rejectWithValue({error:error.data});
        }
    }
)
export const fetchProductAsync = createAsyncThunk<Product,number>(
    'catalog/fetchProductAsync',
    async(productId, thunkAPI)=>{
        try{
            return await Agent.Catalog.details(productId);
        }catch(error:any)
        {
            return thunkAPI.rejectWithValue({error:error.data});
        }
    }
)

export const catalogSlice = createSlice({
    name:'catalog',
    initialState: productsAdapter.getInitialState({
        loadingProduct: false,
        status:'idle'
    }),
    reducers:{},
    extraReducers:(builder=>{
        builder.addCase(fetchProductsAsync.pending, (state)=>{state.status='pendingFetchProducts'});
        builder.addCase(fetchProductsAsync.fulfilled, (state,action)=>{
            productsAdapter.setAll(state,action.payload);
            state.loadingProduct=true;
            state.status='idle';});
        builder.addCase(fetchProductsAsync.rejected, (state)=>{state.status='idle'});
        builder.addCase(fetchProductAsync.pending, (state)=>{state.status='pendingFetchProduct'});
        builder.addCase(fetchProductAsync.fulfilled, (state,action)=>{
            productsAdapter.upsertOne(state,action.payload);
            state.loadingProduct=true;
            state.status='idle';});
        builder.addCase(fetchProductAsync.rejected, (state)=>{state.status='idle'});
    })
})

export const  productSelector= productsAdapter.getSelectors((state:RootState) => state.catalog)