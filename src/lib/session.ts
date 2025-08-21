import axios from "axios";
import { api, apiWithCredentials } from "./api";

export enum UserType {
  student,
  admin,
  professor,
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SignInResponse {
  access_token: string;
  session_id: number;
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await apiWithCredentials.post<SignInResponse>("/auth/sign_in", {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        throw new Error("Invalid email or password.");
      }
      if (error.status === 500) {
        throw new Error(
          "Sign in unavailable at the moment. Please try again later.",
        );
      }
    }
    throw new Error("Failed to sign in. Please try again later.");
  }
}

export async function signOut() {
  try {
    const res = await api.post<{ message: string }>("/auth/sign_out");
    return res.data.message;
  } catch {
    throw new Error("Failed to sign out. Please try again later.");
  }
}

export async function forgotPassword({ email }: { email: string }) {
  try {
    await api.post("/auth/forgot_password", { email });
  } catch {
    throw new Error("Failed to send password reset email.");
  }
}

export async function resetPassword({
  token,
  password,
  password_confirmation,
}: {
  token: string;
  password: string;
  password_confirmation: string;
}) {
  try {
    const res = await api.post<{ message: string }>("/auth/reset_password", {
      token,
      password,
      password_confirmation,
    });
    return res.data.message;
  } catch {
    throw new Error("Failed to reset password. Please try again later.");
  }
}
