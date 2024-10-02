export interface SignUpResponse {
    message: string;
    account: {
      id: string;
      owner_name: string;
      email: string;
	 phone_number: string,
	 subscribed_at: null
    };
  }

  export interface SignUpParams {
    account: {
        owner_name: string,
        email: string,
         password_hash: string,
        phone_number: string
      }
  }