"use client";
import { useGetUserInfo } from "@/lib/queries/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AuthCheck = ({
  children,
  userTypes,
}: {
  children: React.ReactNode;
  userTypes: string[];
}) => {

  const user = useGetUserInfo();
  const router = useRouter();

  useEffect(() => {
    if (!user.data || !userTypes.includes(user.data?.type)) {
      router.push("/");
    }
  }, [user, userTypes, router]);

  if (!user.data || (user.data && !userTypes.includes(user.data?.type))) {
    return null;
  }

  return children;
};
