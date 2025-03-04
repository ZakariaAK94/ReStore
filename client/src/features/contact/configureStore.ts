import { configureStore } from "@reduxjs/toolkit"
import { counterSlice } from "./counterSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../basket/basketSlice";
import { catalogSlice } from "../catalog/catalogSlice";


export const store = configureStore({
    reducer:{
        counter:counterSlice.reducer,
        basket: basketSlice.reducer,
        catalog:catalogSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch =() => useDispatch<AppDispatch>();
export const useAppSelector:TypedUseSelectorHook<RootState>=useSelector;
