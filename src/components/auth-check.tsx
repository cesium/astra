"use client";
import { useGetUserInfo } from "@/lib/queries/session";
import { useAuthStore } from "@/stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const loadingState = (
    <div className="h-full w-full bg-[url(/images/calendar.svg)] bg-center bg-repeat"></div>
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const openRoutes = [
      /^\/auth\/sign-in$/,
      /^\/auth\/forgot-password\/?$/,
      /^\/auth\/forgot-password\/[^/]+$/,
    ];

    if (!isMounted) return;

    const isOpenRoute = openRoutes.some((route) => pathname.match(route));
    if (shouldBeLoggedIn && !token && !isOpenRoute) {
      router.replace("/auth/sign-in");
      return;
    }

    if (shouldBeLoggedIn && token && user.error) {
      router.replace("/auth/sign-in");
      return;
    }

    if (shouldBeLoggedIn && token && isOpenRoute) {
      router.replace("/");
      return;
    }

    if (userTypes && userTypes.length > 0 && user.data) {
      if (!userTypes.includes(user.data.type)) {
        router.replace("/");
        return;
      }
    }
  }, [
    isMounted,
    shouldBeLoggedIn,
    token,
    pathname,
    router,
    user,
    user.data,
    user.error,
    userTypes,
  ]);

  if (!isMounted) return null;

  if (pathname.startsWith("/auth/")) {
    return token ? loadingState : <>{children}</>;
  }

  if (shouldBeLoggedIn) {
    if (user.isLoading) return <></>;
    if (!token || user.error) return loadingState;
  }

  if (userTypes && userTypes.length > 0) {
    if (user.isLoading || !user.data || !userTypes.includes(user.data.type))
      return <></>;
  }

  return <>{children}</>;
};
