import { createSlice } from "@reduxjs/toolkit"

interface CounterState{
    data:number,
    title:string
}

const initialState:CounterState = {    
        data:42,
        title:"YARC: yet another redux counter with Slice"    
}



export const counterSlice = createSlice({
    name:'counter',
    initialState,
    reducers:{
        increment:(state,action)=> {state.data += action.payload},
        decrement:(state,action)=> {state.data -= action.payload},
        reset:(state,action)=> {state.data = action.payload}
    }
})

export const {increment, decrement,reset} = counterSlice.actions;

