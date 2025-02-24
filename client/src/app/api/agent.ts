import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

axios.defaults.baseURL = 'http://localhost:5000/api/';

const sleep = ()=> new Promise(resolve => setTimeout(resolve, 1000));
const responseBody = (response : AxiosResponse) => response.data;

axios.interceptors.response.use(async response =>{
    await sleep();
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
    get:(url:string)=>axios.get(url).then( responseBody),
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
    list: ()=>Requests.get('products'),
    details:(id:number) => Requests.get(`products/${id}`)
}

const Agent = {
    Catalog,
    TestErrors
}

export default Agent;