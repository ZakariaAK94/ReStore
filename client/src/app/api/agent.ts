import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;

const sleep = ()=> new Promise(resolve => setTimeout(resolve, 1000));
const responseBody = (response : AxiosResponse) => response.data;

axios.interceptors.response.use(async response =>{
    await sleep();
    const pagination = response.headers["pagination"];
    if(pagination)
    {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    } 
    return response
},(error:AxiosError)=>{
    const {data, status} = error.response as AxiosResponse;
    switch(status)
    {
        case 400:
            if(data.errors)
                {
                    const modelStateErrors:string[] = [];
                    for(const key in data.errors)
                    {
                        if(data.errors[key])
                            modelStateErrors.push(data.errors[key])
                    }
                    throw modelStateErrors.flat();
                }
            toast.error(data.title)
            break;
        case 401:
            toast.error(data.title)
            break;
        case 404:
            toast.error(data.title)
            break;
        case 500:
            router.navigate('/server-error', {state:{error:data}})
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const Requests = {
    get:(url:string, params?:URLSearchParams)=>axios.get(url,{params}).then( responseBody),
    post:(url:string, body:{})=>axios.post(url, body).then( responseBody),
    put:(url:string, body:{})=>axios.put(url, body).then( responseBody),
    delete:(url:string)=>axios.delete(url).then( responseBody),
}

const TestErrors = {
    get400Error : ()=> axios.get("buggy/bad-request"),
    get401Error : ()=> axios.get("buggy/unauthorised"),
    get404Error : ()=> axios.get("buggy/not-found"),
    get500Error : ()=> axios.get("buggy/server-error"),
    getValidationError : ()=> axios.get("buggy/validation-error"),
}

const Catalog = {
    list: (params:URLSearchParams)=>Requests.get('products', params),
    details:(id:number) => Requests.get(`products/${id}`),
    fetchFilters: () => Requests.get('products/filters')
}

const Basket = {
    get: () => Requests.get('basket'),
    addItems : (productId:number, quantity=1) => Requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItems : (productId:number, quantity=1) => Requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}


const Agent = {
    Catalog,
    TestErrors,
    Basket
}

export default Agent;