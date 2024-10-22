import { UserLoginParams,LoginResponse } from "../type/login";

export async function UserLogin({ email, password }: UserLoginParams): Promise<{ data: LoginResponse}> {
  const response = await fetch(`http://localhost:4000/api/accounts/signIn`, {
    method: "POST",
    headers: {
      // "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      hash_password: password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to login, please check your credentials.');
  }

  return response.json();
}
