 export interface UserLoginParams {
    email: string;
    password: string;
  }

  export interface Login {
    message: string,
    token: string,
    id: string,
    owner_name:string,
    email:string
  }

  export interface LoginResponse {
    message: string;
    token: string;
    account: {
      id: string;
      owner_name: string;
      email: string;
    };
  }