export interface Basket {
    id: number
    buyerId: string
    items: BasketItem[]
    clientSecret:string
    paymentIntentId:string
  }
  
  export interface BasketItem {
    productId: number
    name: string
    price: number
    pictureUrl: string
    type: string
    brand: string
    quantity: number
  }