export interface CounterState{
    data:number,
    title:string
}

export function increment(amount =1)
{
    return {
        type:"INCREMENT_COUNTER",
        payload: amount
    }
}

export function decrement(amount =1)
{
    return {
        type:"DECREMENT_COUNTER",
        payload: amount
    }
}

export function reset(amount=42)
{
    return {
        type:"RESET_COUNTER",
        payload: amount
    }
}

const initialState:CounterState ={
    data:42,
    title:"YARC: yet another redux counter"
}

export function counterReducer(state=initialState, action:any)
{
    switch (action.type) {
        case "INCREMENT_COUNTER":
            return {
                ...state, data: state.data+action.payload
            }
        case "DECREMENT_COUNTER":
        return {
            ...state, data: state.data-action.payload
        }
        case "RESET_COUNTER":
        return {
            ...state, data: action.payload
        }    
        default:
            return state;
    }
}


