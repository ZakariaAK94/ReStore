
import { Basket } from "../models/Basket";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface StoreContextValue{
    basket: Basket | null,
    setBasket: (basket:Basket)=>void,
    removeItem: (productId: number, quantity:number)=>void
}


export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function useStoreContext()
{
    const context  = useContext(StoreContext);

    if(context === undefined)
        throw Error("StoreContext must be used within a StoreProvider")

    return context
}

export function StoreProvider({children}:PropsWithChildren)
{
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeItem(productId:number, quantity:number)
    {
            if(basket===null) return;

            const items = [...basket.items];

            const itemIndex = items.findIndex(item=>item.productId === productId)

            if(itemIndex>=0)
                items[itemIndex].quantity -= quantity;
            if(items[itemIndex].quantity === 0)
                items.splice(itemIndex,1);

            setBasket(prev =>{
                return {...prev!, items}
            });
   }

    return (
        <StoreContext.Provider value={{basket,setBasket,removeItem}}>
                {children}
        </StoreContext.Provider>
    )
}






















