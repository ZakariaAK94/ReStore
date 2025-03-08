import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/Product";
import Agent from "../../app/api/agent";
import { RootState } from "../contact/configureStore";
import { MetaData } from "../../app/models/pagination";

interface CatalogState{
    loadingProduct: boolean,
    filterLoading: boolean,
    status:string,
    brands:string[],
    types:string[],
    productParams: ProductParams;
    metaData: MetaData | null;
}

function getAxiosParameters(productParams: ProductParams)
{
    var params = new URLSearchParams();
    params.append('orderBy', productParams.orderBy);
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    if(productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
    if(productParams.types.length) params.append('types', productParams.types.toString());
    if(productParams.brands.length) params.append('brands', productParams.brands.toString());
    
    return params;
}

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[], void, {state:RootState}>(
    'catalog/fetchProductsAsync',
    async(_,thunkAPI)=>{
        var params = getAxiosParameters(thunkAPI.getState().catalog.productParams);
        try{
            var response = await Agent.Catalog.list(params);
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
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

export const fetchFiltersProductAsync = createAsyncThunk(
    'catalog/fetchFiltersProductAsync',
    async(_, thunkAPI)=>{
        try{
            return await Agent.Catalog.fetchFilters();
        }catch(error:any)
        {
            return thunkAPI.rejectWithValue({error:error.data});
        }
    }
)

export const initParams = { pageNumber:1, pageSize:6, orderBy: 'name', brands:[], types:[] };  



export const catalogSlice = createSlice({
    name:'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        loadingProduct: false,
        filterLoading: false,
        status:'idle',
        brands:[],
        types:[],
        productParams:initParams,
        metaData:null
        }),
    reducers:{
        setProductParams: (state, action) => {
            state.loadingProduct = false;
            state.productParams = {...state.productParams, ...action.payload, pageNumber:1};
        },
        setPageNumber: (state, action) => {
            state.loadingProduct = false;
            state.productParams = {...state.productParams, ...action.payload};
        },
        setMetaData: (state, action)=>{
            state.metaData = action.payload;
        },
        resetProductParams: (state)=>{
            state.productParams = initParams;
        }

    },
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

        builder.addCase(fetchFiltersProductAsync.pending, (state)=>{state.status = "pendingFetchFilters"});
        builder.addCase(fetchFiltersProductAsync.fulfilled, (state, action)=>{
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.status = "idle";
            state.filterLoading=true;
        });
        builder.addCase(fetchFiltersProductAsync.rejected, (state,action)=>{
            console.log(action.error);
            state.status = 'idle'
        });
    })
})

export const  productSelector= productsAdapter.getSelectors((state:RootState) => state.catalog)

export const {setProductParams, resetProductParams, setMetaData, setPageNumber} = catalogSlice.actions;