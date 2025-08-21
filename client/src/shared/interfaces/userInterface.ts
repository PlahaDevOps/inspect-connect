export type UserRole = 0 | 1 | 2;

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
