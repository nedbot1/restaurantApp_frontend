
import type { restaurant, menu, table, session, Order } from "../type/restaurant_type";

export async function fetchRestaurant(): Promise<{ data: restaurant[] }>{
    const response = await fetch("http://localhost:4000/api/restaurants");
    if (!response.ok) {
    throw new Error('Failed to fetch restaurant');
  }
  return response.json();
}

export async function fetchMenu(): Promise<{ data: menu[] }>{
    const response = await fetch(`http://localhost:4000/api/menus
`);
    if (!response.ok) { 
        throw new Error('Failed to fetch dishes');
    }
    return response.json()
}

export async function fetchTable(): Promise<{ data: table[] }> {
    const response = await fetch('http://localhost:4000/api/tables')
    if (!response.ok) {
        throw new Error('failed to fetch tables')
    }
    return response.json()
}


export async function fetchOrder(): Promise<{ data: Order[] }>{
    const response = await fetch('http://localhost:4000/api/orders')
    if (!response.ok) {
        throw new Error('failed to fetch orders')
    }
    return response.json()
}

export async function updatePayment(
  order_id: string
): Promise<{ data: Order }> {
  try {
    const response = await fetch(
      `http://localhost:4000/api/orders/${order_id}`,
      {
        method: "PATCH", // PATCH is more appropriate for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            payed_at: new Date().toISOString(), 
          }, 
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update payment");
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    console.error("Error updating payment:", err);
    throw err;
  }
}

