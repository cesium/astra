'use client'

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
  disabled?: boolean,
  className?: string,
}

function InputLine({ label, value, disabled=false, className}: IInputLineProps) {
  return (
    <div className={twMerge(clsx("flex flex-col gap-2 md:flex-row justify md:items-center", className))}>
      <Label size="large" className="text-dark/50 flex-1">{label}</Label>
      <Input disabled={disabled} placeholder={value} className="flex-1 max-w-lg"/>
    </div>
  )
}

export default function Account() {
  const user = useGetUserInfo();

  function treatName(name: string) {
    return name.split(' ').filter(Boolean)[0] + ' ' + name.split(' ').filter(Boolean).slice(-1)[0];
  }
    
  return (
    <SettingsWrapper title="Account and profile">
      <div className="flex flex-col items-center md:items-start">
        <title>Pombo | Account</title>

        <div className="space-y-10 w-full max-w-md md:max-w-none">
          <section className="flex items-center justify-center md:justify-start md:items-start gap-5 md:gap-7.5">
            <Avatar name={user.data?.name} className="size-25 md:size-30 lg:size-35"/>
            <div className="md:pt-3.5 space-y-1">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-dark">{ user.data?.name ? treatName(user.data?.name) : ""}</h2>
              <p className="text-sm md:text-base font-semibold">{user.data?.email}</p>
            </div>
          </section>

          <section className="flex flex-col gap-3.5 items-center md:items-start">
            <h2 className="text-xl md:text-2xl font-semibold">Information</h2>
            <div className="flex flex-col gap-1.5 w-full max-w-3xl">
              <InputLine disabled label="Full Name" value={user.data?.name || "user name"} />
              <InputLine disabled label="Email" value={user.data?.email || "user email"} />
              <InputLine className="mt-6" label="Current password" value={"current password"} />
              <InputLine label="New password" value={"New password"} />
              <InputLine label="Confirm password" value={"New password"} />
              <button className="md:self-end px-4 py-2 bg-primary-400 text-white rounded-lg mt-6 hover:bg-primary-400/95 min-w-1/3 font-semibold transition-all duration-200 cursor-pointer hover:scale-98">Change Password</button>
            </div>
          </section>
        </div>
      </div>
    </SettingsWrapper>
    );
}
