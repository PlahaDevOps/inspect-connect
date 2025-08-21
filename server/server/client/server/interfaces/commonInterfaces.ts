import type { ConnectOptions } from "mongoose";
import { IUser } from "./userInterface";

export interface DatabaseConfig {
  uri: string;
  options: ConnectOptions;
}

export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  body: T;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  tokenFound: string;
  password: string;
}

export interface ResetPasswordLinkInput {
  token: string;
  email: string;
}

export interface IMailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}
