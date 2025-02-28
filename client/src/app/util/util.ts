 import Cookies from "js-cookie";

export function getCookie(key: string) {
    return Cookies.get(key) || "";
}

export const currencyFormat = (amount:number) => '$'+(amount/100).toFixed(2);