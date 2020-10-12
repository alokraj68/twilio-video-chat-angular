export interface User {
  id: number;
  sub: number;
  username:	string;
  email: string;
  password: string;
  access_token: string;
  isPartner: boolean;
  role: string;
}
