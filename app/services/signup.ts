import { SignUpResponse, SignUpParams } from "../type/signup";

export async function UserSignUp(account: SignUpParams): Promise<{ data: SignUpResponse }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
    {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        account: {
          owner_name: account.owner_name,
          email: account.email,
          password_hash: account.password_hash,
          phone_number: account.phone_number,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to sign up, please check your credentials.');
  }

  return response.json();
}
