"use client";

import Avatar from "@/components/avatar";
import Input from "@/components/input";
import Label from "@/components/label";
import SettingsWrapper from "@/components/settings-wrapper";
import { useGetUserInfo } from "@/lib/queries/session";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface IInputLineProps {
  label: string;
  value: string;
  disabled?: boolean;
  className?: string;
}

function InputLine({
  label,
  value,
  disabled = false,
  className,
}: IInputLineProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "justify flex flex-col gap-2 md:flex-row md:items-center",
          className,
        ),
      )}
    >
      <Label size="large" className="text-dark/50 flex-1">
        {label}
      </Label>
      <Input
        disabled={disabled}
        placeholder={value}
        className="max-w-lg flex-1"
      />
    </div>
  );
}

export default function Account() {
  const user = useGetUserInfo();

  function treatName(name: string) {
    return (
      name.split(" ").filter(Boolean)[0] +
      " " +
      name.split(" ").filter(Boolean).slice(-1)[0]
    );
  }

  return (
    <SettingsWrapper title="Account and profile">
      <div className="flex flex-col items-center md:items-start">
        <title>Pombo | Account</title>

        <div className="w-full max-w-md space-y-10 md:max-w-none">
          <section className="flex items-center justify-center gap-5 md:items-start md:justify-start md:gap-7.5">
            <Avatar
              name={user.data?.name}
              className="size-25 md:size-30 lg:size-35"
            />
            <div className="space-y-1 md:pt-3.5">
              <h2 className="text-dark text-xl font-semibold sm:text-2xl lg:text-3xl">
                {user.data?.name ? treatName(user.data?.name) : ""}
              </h2>
              <p className="text-sm font-semibold md:text-base">
                {user.data?.email}
              </p>
            </div>
          </section>

          <section className="flex flex-col items-center gap-3.5 md:items-start">
            <h2 className="text-xl font-semibold md:text-2xl">Information</h2>
            <div className="flex w-full max-w-3xl flex-col gap-1.5">
              <InputLine
                disabled
                label="Full Name"
                value={user.data?.name || "user name"}
              />
              <InputLine
                disabled
                label="Email"
                value={user.data?.email || "user email"}
              />
              <InputLine
                className="mt-6"
                label="Current password"
                value={"current password"}
              />
              <InputLine label="New password" value={"New password"} />
              <InputLine label="Confirm password" value={"New password"} />
              <button className="bg-primary-400 hover:bg-primary-400/95 mt-6 min-w-1/3 cursor-pointer rounded-lg px-4 py-2 font-semibold text-white transition-all duration-200 hover:scale-98 md:self-end">
                Change Password
              </button>
            </div>
          </section>
        </div>
      </div>
    </SettingsWrapper>
  );
}
