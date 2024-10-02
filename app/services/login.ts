import { UserLoginParams,LoginResponse } from "../type/login";

export async function UserLogin({ email, password }: UserLoginParams): Promise<{ data: LoginResponse}> {
  const response = await fetch(`http://localhost:4000/api/login`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        email,
        password
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to login, please check your credentials.');
  }

  return response.json();
}
