export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  bio?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}
