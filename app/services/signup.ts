import { SignUpResponse, SignUpParams } from "../type/signup";

export async function UserSignUp(account: SignUpParams): Promise<{ data: SignUpResponse }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/create`,
    {
      method: "POST",
      headers: {
        // "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        account: {
          full_name: account.full_name,
          email: account.email,
          hash_password: account.hash_password,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to sign up, please check your credentials.');
  }

  return response.json();
}
