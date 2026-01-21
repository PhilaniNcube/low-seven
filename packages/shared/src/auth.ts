import type { Auth } from "better-auth";

// Re-export better-auth types
export type { Auth };
export type Session = Awaited<ReturnType<Auth["api"]["getSession"]>>;
export type User = NonNullable<Session>["user"];

// Admin-related types
export interface AdminUser {
  id: string;
  userId: string;
  role: string;
  permissions: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminContext {
  user: User;
  admin: AdminUser | undefined;
}

// Auth response types
export interface AuthErrorResponse {
  error: string;
}

export interface AuthSuccessResponse<T = unknown> {
  data: T;
  message?: string;
}

export type AuthResponse<T = unknown> = AuthSuccessResponse<T> | AuthErrorResponse;
