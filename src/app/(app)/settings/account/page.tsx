"use client";

import Avatar from "@/components/avatar";
import Input from "@/components/input";
import Label from "@/components/label";
import SettingsWrapper from "@/components/settings-wrapper";
import { useChangePassword } from "@/lib/mutations/session";
import { useGetUserInfo } from "@/lib/queries/session";
import { firstLastName } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import z from "zod";

interface IInputLineProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  disabled?: boolean;
  className?: string;
  errorMessage?: string;
}

function InputLine({
  label,
  value,
  disabled = false,
  className,
  errorMessage,
  ...rest
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

      <div className="flex flex-1 flex-col">
        <Input
          disabled={disabled}
          placeholder={value}
          className="max-w-lg flex-1"
          {...rest}
        />

        <span className="text-danger px-1">{errorMessage}</span>
      </div>
    </div>
  );
}

const formSchema = z
  .object({
    current_password: z
      .string()
      .min(12, { message: "The password should have at least 12 characters" })
      .max(72, {
        message: "The password should be smaller than 72 characters",
      }),
    password: z
      .string()
      .min(12, { message: "The password should have at least 12 characters" })
      .max(72, {
        message: "The password should be smaller than 72 characters",
      }),
    password_confirmation: z
      .string()
      .min(12, { message: "The password should have at least 12 characters" })
      .max(72, {
        message: "The password should be smaller than 72 characters",
      }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

type FormSchema = z.infer<typeof formSchema>;

export default function Account() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    changePassword.mutate({ ...data });
  };

  const user = useGetUserInfo();
  const changePassword = useChangePassword();

  return (
    <SettingsWrapper title="Account and profile">
      <div className="flex flex-col items-center md:items-start">
        <title>Pombo | Account</title>

        <div className="w-full max-w-md space-y-5 md:max-w-none md:space-y-10">
          <section className="flex items-center justify-center gap-5 md:items-start md:justify-start md:gap-7.5">
            <Avatar
              name={user.data?.name}
              className="size-25 md:size-30 lg:size-35"
            />
            <div className="space-y-1 md:pt-3.5">
              <h2 className="text-dark text-xl font-semibold sm:text-2xl lg:text-3xl">
                {firstLastName(user.data?.name)}
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-1.5">
                <InputLine
                  id="current_password"
                  type="password"
                  className="mt-6"
                  label="Current password"
                  value={"current_password"}
                  placeholder="Current password"
                  {...register("current_password", { required: true })}
                  errorMessage={errors.current_password?.message}
                />
                <InputLine
                  id="password"
                  type="password"
                  label="New password"
                  value={"password"}
                  placeholder="New password"
                  {...register("password", { required: true })}
                  errorMessage={errors.password?.message}
                />
                <InputLine
                  id="password_confirmation"
                  type="password"
                  label="Confirm password"
                  value={"password_confirmation"}
                  placeholder="Confirm password"
                  {...register("password_confirmation", { required: true })}
                  errorMessage={errors.password_confirmation?.message}
                />
                <button
                  type="submit"
                  className="bg-primary-400 hover:bg-primary-400/95 mt-6 cursor-pointer rounded-lg px-4 py-2 font-semibold text-white transition-all duration-200 hover:scale-98 md:w-1/3"
                >
                  Change Password
                </button>

                {changePassword.isSuccess && (
                  <p className="text-dark/50">Password Changed Successfully</p>
                )}

                {changePassword.isError && (
                  <p className="text-dark/50">{changePassword.error.message}</p>
                )}
              </form>
            </div>
          </section>
        </div>
      </div>
    </SettingsWrapper>
  );
}
