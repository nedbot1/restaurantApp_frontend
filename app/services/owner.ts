import { Restaurant } from "../type/restaurant";
import { Order } from "../type/type";

export async function fetchOrder(restaurantID:string): Promise<{ data:Order}> {
  const response = await fetch(`http://localhost:4000/api/orders/restaurant/${restaurantID}`);

  if (!response.ok) {
    throw new Error('Failed to login, please check your credentials.');
  }

  return response.json();
}

export async function fetchRestaurant(accountId:string): Promise<{ data:Resaurant}> {
    const response = await fetch(`http://localhost:4000/api/restaurants/account/${accountId}`);
  
    if (!response.ok) {
      throw new Error('Failed to login, please check your credentials.');
    }
  
    return response.json();
  }