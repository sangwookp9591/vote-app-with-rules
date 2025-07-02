export interface User {
  id: string;
  email: string;
  nickname: string;
  name?: string;
  profileImageUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  profileImageUrl?: string;
}
