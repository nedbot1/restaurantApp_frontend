export interface Restaurant {
  id: string
  name: string
  location : string
  contact_number: string
  account_id: string
}

export interface Menu {
  id:string
  price: number
  item_name: string
  item_description: string
  dish_photo_link : string
  restaurant_id: string
  category_name: string
  menus: Menu[]
}

export interface Table {
  id:string
  table_number: string
  qr_code : string
  status : string
  restaurant_id: string
}

export interface Session {
  id: string
  session_token: string
  start_time: Date
  end_time: Date;
}

export interface Order {
  id: string
  ordered_at: Date
  payed_at: Date
  total_amount: number
  session_id: string,
  order_lists: any,
  table_number:string
}

export interface Category{
  id: string
  name: string
}
