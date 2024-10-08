import { Restaurant } from "../type/restaurant";
import { Order } from "../type/type";

export async function fetchOrder(restaurantID:string): Promise<{ data:Order}> {
  const response = await fetch(`http://localhost:4000/api/orders/restaurant/${restaurantID}`);

  if (!response.ok) {
    throw new Error('Failed to login, please check your credentials.');
  }

  return response.json();
}

export async function fetchRestaurant(accountId:string): Promise<{ data:Restaurant}> {
    const response = await fetch(`http://localhost:4000/api/restaurants/account/${accountId}`);
  
    if (!response.ok) {
      throw new Error('Failed to login, please check your credentials.');
    }
  
    return response.json();
  }

  export async function createRestaurant(restaurant:Restaurant): Promise<{ data:Restaurant}> {
    const response = await fetch(`http://localhost:4000/api/restaurants`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
        body: JSON.stringify({
          restaurant: {
            name: restaurant.name,
            location: restaurant.location,
            contact_number: restaurant.contact_number,
            account_id: restaurant.account_id,
          },
      })
    })
    if (!response.ok) {
      throw new Error('Failed to login, please check your credentials.');
    }
  
    return response.json();
  }