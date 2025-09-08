"use client";
import { useGetUserInfo } from "@/lib/queries/session";
import { useAuthStore } from "@/stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OPEN_ROUTES = ["/auth/sign_in", "/auth/forgot_password"];

export const AuthCheck = ({
  children,
  userTypes,
  shouldBeLoggedIn = false,
}: {
  children: React.ReactNode;
  userTypes?: string[];
  shouldBeLoggedIn?: boolean;
}) => {
  const user = useGetUserInfo();
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const [isMounted, setIsMounted] = useState(false);
  const loadingState = <div className="w-full h-full bg-[url(/images/calendar.svg)] bg-center bg-repeat"></div>

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isOpenRoute = OPEN_ROUTES.includes(pathname);

    if (shouldBeLoggedIn && !token && !isOpenRoute) {
      router.replace("/auth/sign_in");
      return;
    }

    if (shouldBeLoggedIn && token && user.error) {
      router.replace("/auth/sign_in");
      return;
    }

    if (shouldBeLoggedIn && token && pathname === "/auth/sign_in") {
      router.replace("/");
      return;
    }

    if (userTypes && userTypes.length > 0 && user.data) {
      if (!userTypes.includes(user.data.type)) {
        router.replace("/");
        return;
      }
    }
  }, [isMounted, shouldBeLoggedIn, token, pathname, router, user.data, user.error, userTypes]);

  if (!isMounted) return null;

  if (pathname === "/auth/sign_in") {
    return token ? loadingState : <>{children}</>;
  }

  if (OPEN_ROUTES.includes(pathname) && !shouldBeLoggedIn) {
    return token ? loadingState : <>{children}</>;
  }

  if (shouldBeLoggedIn) {
    if (user.isLoading) return <></>;
    if (!token || user.error) return loadingState;
  }

  if (userTypes && userTypes.length > 0) {
    if (user.isLoading || !user.data || !userTypes.includes(user.data.type)) return <></>;
  }

  return <>{children}</>;
};