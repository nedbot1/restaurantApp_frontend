
import type { Restaurant, Menu, Table, Session, Order } from "../type/type";

export async function fetchRestaurant(): Promise<{ data: Restaurant[] }>{
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`
    );
    if (!response.ok) {
    throw new Error('Failed to fetch restaurant');
  }
  return response.json();
}

export async function fetchMenu(
  restaurantId: number
): Promise<{ data: Menu[] }>{
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/menus?restaurant_id=${restaurantId}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) { 
        throw new Error('Failed to fetch dishes');
    }
    return response.json()
}

export async function fetchTables(): Promise<{ data: table[] }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tables`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error('failed to fetch tables')
    }

  return response.json()
}
export async function createTable(tableArray : Array<Partial<table>>) : Promise <{ data: table }> {
    console.log(tableArray, "table array")
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tables/batch`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          tables: tableArray
        })
      }
    )
    return response.json()
  }

export async function regenerateQrCode(tableId: string): Promise<{ data: table }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tables/${tableId}/regenerate_qr_code`,
      {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error('failed to fetch tables')
    }
    return response.json()
  }

export async function fetchOrder(): Promise<{ data: Order[] }>{
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) {
        throw new Error('failed to fetch orders')
    }
    return response.json()
}
export async function fetchUnpaidOrder(): Promise<{ data: Order[] }>{
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/unpaid`,
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order_id}`,
      {
        method: "PUT", // PATCH is more appropriate for updates
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Accept: "application/json",
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

