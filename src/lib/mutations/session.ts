import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  forgotPassword,
  resetPassword,
  signIn,
  signOut,
} from "../session";
import { useAuthStore } from "@/stores/authStore";

export function useSignIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      useAuthStore.getState().setToken(data.access_token);
      localStorage.setItem("session_id", data.session_id.toString());
      qc.invalidateQueries({ refetchType: "all", queryKey: ["session"] });
      qc.invalidateQueries({ refetchType: "all", queryKey: ["user"] });
    },
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      useAuthStore.getState().clearToken();
      localStorage.removeItem("session_id");
      qc.invalidateQueries({ refetchType: "all", queryKey: ["session"] });
      qc.removeQueries({ queryKey: ["user"] });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
