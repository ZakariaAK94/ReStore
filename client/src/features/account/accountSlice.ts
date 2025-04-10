import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import Agent from "../../app/api/agent";
import { FieldValues } from "react-hook-form";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
    user:User | null
}

const initialState:AccountState= {
    user:null
}

export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async(data,thunkAPI)=>{
        try {
            var userDTO =await Agent.Account.login(data);
            const {basket, ...user}=userDTO;
            if(basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }catch (error:any) 
        {
            return thunkAPI.rejectWithValue({error:error.data})
        }
    }
)

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async(_,thunkAPI)=>{
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)))
        try {      
            var userDTO =await Agent.Account.currentUser();
            const {basket, ...user}=userDTO;
            if(basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user',JSON.stringify(user));
            return user;
        }catch (error:any) 
        {
            return thunkAPI.rejectWithValue({error:error.data})
        }
    },{
        condition:()=>
        {
               if(!localStorage.getItem('user')) return false;
        }
    }
   
)

export const accountSlice = createSlice({
    name:'account',
    initialState,
    reducers:{
        SiginOut:(state)=>{
            state.user = null;
            localStorage.removeItem("user");
            router.navigate("/")
        },
        setUser:(state, action) =>{
            let claims = JSON.parse(atob(action.payload.token.split(".")[1]));
            let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, roles:typeof(roles) === 'string' ? [roles] : roles};
        }
    },
    extraReducers:(builder=>{
        builder.addCase(fetchCurrentUser.rejected, (state, action)=>{
            state.user = null;
            localStorage.removeItem('user');
            toast.error("Session expired - logging again");
            router.navigate('/');
        })
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),(state,action)=>{
            let claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload,roles:typeof(roles) === 'string' ? [roles]:roles}
        });
        builder.addMatcher(isAnyOf(signInUser.rejected),(state,action)=>{
            throw action.payload;
        })
    })
})

export const {SiginOut, setUser} = accountSlice.actions;