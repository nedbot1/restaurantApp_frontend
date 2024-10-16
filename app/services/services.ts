
import type { Restaurant, Menu, Table, Session, Order, Category } from "../type/type";

export async function addRestaurant(restaurantData: Partial<Restaurant>): Promise<{ data: Restaurant[] }>{
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`,
    {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify({
        restaurant: restaurantData,
      }),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to add restaurant');
  }
  return response.json();
}

export async function fetchRestaurant(accountId: string): Promise<{ data: Restaurant[] }>{
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/account/${accountId}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Cache-Control": "no-store",
        },
      }
    );
    if (!response.ok) {
    throw new Error('Failed to fetch restaurant');
  }
  return response.json();
}               

export async function fetchMenu(
  restaurantId: string
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

export async function fetchCategory(): Promise<{ data: Category[] }>{
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
     {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) {
    throw new Error('Failed to fetch restaurant');
  }
  return response.json();
}

export async function createMenu(
  menuArray: Array<Partial<Menu>>
): Promise<{ data: Table }> {
  console.log(menuArray, "menu array");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/menus/batch`,
    {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        menus: menuArray,
      }),
    }
  );
  return response.json();
}

export async function createTable(
  tableArray: Array<Partial<Table>>
): Promise<{ data: Table }> {
  console.log(tableArray, "table array");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tables/batch`,
    {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        tables: tableArray,
      }),
    }
  );
  return response.json();
}

export async function fetchTables(restaurantId: string): Promise<{ data: Table[] }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}//api/tables/by_restaurant/${restaurantId}`,
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


export async function regenerateQrCode(tableId: string): Promise<{ data: Table }> {
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

