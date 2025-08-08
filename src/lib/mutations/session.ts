import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  refreshToken,
  resetPassword,
  signIn,
  signOut,
} from "../session";

export function useSignIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("session_id", data.session_id.toString());
      qc.invalidateQueries({ refetchType: "all", queryKey: ["session"] });
    },
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("session_id");
      qc.removeQueries({ queryKey: ["session"] });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useRefreshToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: (accessToken) => {
      localStorage.setItem("access_token", accessToken);
      qc.invalidateQueries({ refetchType: "all", queryKey: ["session"] });
    },
    onError: () => {
      localStorage.removeItem("access_token");
      qc.invalidateQueries({ refetchType: "all", queryKey: ["session"] });
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
