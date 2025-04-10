import { useEffect } from 'react'
import { productSelector, fetchProductsAsync, fetchFiltersProductAsync } from '../../features/catalog/catalogSlice';
import { useAppSelector, useAppDispatch } from '../../features/contact/configureStore';

function useProducts() {

    const products = useAppSelector(productSelector.selectAll);
    const dispatch = useAppDispatch();
    const {loadingProduct, filterLoading, brands, types, metaData} = useAppSelector(state => state.catalog);
    
    useEffect(()=>{
    if(!loadingProduct) dispatch(fetchProductsAsync());
    },[dispatch,loadingProduct]);
    
    useEffect(()=>{
        if(!filterLoading) dispatch(fetchFiltersProductAsync());
    }, [dispatch, filterLoading]);
    

  return {
    products,
    brands,
    types,
    metaData,
    loadingProduct,
    filterLoading,
    dispatch
  }
}

export default useProducts