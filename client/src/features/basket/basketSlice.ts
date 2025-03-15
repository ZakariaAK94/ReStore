import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/Basket";
import Agent from "../../app/api/agent";
import { getCookie } from "../../app/util/util";

interface BasketState{
    basket:Basket | null,
    status:string
}

const initialState:BasketState ={
    basket:null,
    status:"idle"
}

export const fetchBasketAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketAsync',
    async(__,thunkAPI)=>{
        try{
            return await Agent.Basket.get();
        }catch(error:any)
        {
            return thunkAPI.rejectWithValue({error:error.data});
        }
    },{
        condition:()=>{
            if(!getCookie('buyerId')) return false;
        }
    }
)

export const addBasketItemAsync = createAsyncThunk<Basket, {productId:number, quantity:number}>(
    'basket/addBasketItemAsync',
    async({productId, quantity}, thunkAPI)=>{ 
        try{
            return await Agent.Basket.addItems(productId, quantity);
        }catch(error:any)
        {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, {productId: number, quantity?:number, name?:string}>(
    'basket/removeBasketItemAsync',
    async({productId, quantity=1},thunkAPI)=>{
            try{
                return await Agent.Basket.removeItems(productId, quantity);
            }catch(error:any)
            {
                return thunkAPI.rejectWithValue({error: error.data});
            }
    }
)

export const basketSlice = createSlice({
    name:'basket',
    initialState,
    reducers:{
        setBasket:(state, action) =>{state.basket=action.payload},
        clearBasket:(state)=>{state.basket=null}
    },
    extraReducers:(builder) =>
        builder
        .addCase(addBasketItemAsync.pending, (state, action)=>{            
        state.status = 'pendingAddItem'+action.meta.arg.productId;
            })      
        .addCase(removeBasketItemAsync.pending, (state, action)=>{            
        state.status = 'pendingRemoveItem'+action.meta.arg.productId + action.meta.arg.name;})
        .addCase(removeBasketItemAsync.fulfilled, (state, action)=>{
            const {productId, quantity} = action.meta.arg;
            if(!state.basket) return;
            const existingItem = state.basket.items.findIndex(i=>i.productId===productId);
            if(existingItem !==-1 || existingItem === undefined)
                state.basket.items[existingItem].quantity -= quantity!;
            if(state.basket.items[existingItem].quantity === 0)
                state.basket.items.splice(existingItem,1);
            state.status = 'idle';})
        .addCase(removeBasketItemAsync.rejected, (state,action)=>{
            state.status = 'idle';
            console.log(action.payload)})  
        .addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled), (state, action)=>{
                state.basket = action.payload;
                state.status = 'idle';})
        .addMatcher(isAnyOf(addBasketItemAsync.rejected,fetchBasketAsync.rejected), (state, action)=>{
                state.status = 'idle';
                console.log(action.payload)})
        
})



export const {setBasket, clearBasket} = basketSlice.actions;