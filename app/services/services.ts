
import type { restaurant, menu, table, session, Order } from "../type/type";

export async function fetchRestaurant(): Promise<{ data: restaurant[] }>{
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`
    );
    if (!response.ok) {
    throw new Error('Failed to fetch restaurant');
  }
  return response.json();
}               

export async function fetchMenu(): Promise<{ data: menu[] }>{
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/menus`,
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

export async function fetchTable(): Promise<{ data: table[] }> {
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

  // try {
  //   const response = await fetch(
  //     `https://93c4-119-2-104-121.ngrok-free.app/api/tables`
  //   );
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }
  //   const contentType = response.headers.get("Content-Type");
  //   if (contentType && contentType.includes("text/html")) {
  //     const text = await response.text();
  //     throw new Error(`Unexpected HTML response: ${text}`);
  //   }
  //   const data = await response.json();
  //   console.log("Table data:", data);
  // } catch (error) {
  //   console.error("Error fetching tables:", error);
  // }
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

