 export interface Order  {
  id: number
  buyerId: string
  shippingAddress: ShippingAddress
  date: string
  orderItems: OrderItem[]
  subtotal: number
  deliveryFee: number
  orderStatus: string
  total: number
}

export interface ShippingAddress {
  fullName: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  country: string
}

export interface OrderItem {
  productId: number
  name: string
  pictureUrl: string
  price: number
  quantity: number
}