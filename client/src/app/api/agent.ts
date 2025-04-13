import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { toast } from "react-toastify";
import { store } from "../../features/contact/configureStore";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const sleep = ()=> new Promise(resolve => setTimeout(resolve, 1000));
const responseBody = (response : AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async (response) =>{
    if(process.env.NODE_ENV === "development") await sleep();
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
            toast.error("Your username or password are not valid");
            break;
        case 403:
            toast.error('You are not allowed to make this change!!');
            break;
        case 404:
            toast.error(data.title);
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
    postForm:(url:string, data: FormData) => axios.post(url,data, {headers: {
        'Content-Type': 'multipart/form-data'
      }}).then(responseBody),
    putForm:(url:string, data: FormData) => axios.put(url,data, {headers: {
      'Content-Type': 'multipart/form-data'
    }}).then(responseBody)
    
}

function createFormData(items:any)
{
    let formData = new FormData();
    for(const key in items)
    {
        formData.append(key,items[key])
    }

    return formData;
}

const Admin ={
    createProduct:(product:any) => axios.postForm('products/',createFormData(product)),
    updateProduct:(product:any) => axios.putForm('products/',createFormData(product)),
    delete:(id:number) => axios.delete(`products/${id}`)
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

const Account ={
    login:(values:any) => Requests.post('account/login',values),
    register:(values:any) => Requests.post('account/register',values),
    currentUser: () => Requests.get('account/currentUser'),
    fetchAddress:()=>Requests.get('account/savedAddress')
}

const Payment ={
    createPaymentIntent : ()=>Requests.post('payments',{})
}
const Order = {
    list:()=>Requests.get('orders'),
    fetch:(id:number) => Requests.get(`orders/${id}`),
    create:(values:any)=>Requests.post('orders',values)
    
}

const Agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Order,
    Payment,
    Admin
}

export default Agent;