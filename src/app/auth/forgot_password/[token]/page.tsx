"use client";

import Input from "@/components/input";
import Label from "@/components/label";
import { useResetPassword } from "@/lib/mutations/session";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import Image from "next/image";

const formSchema = z
  .object({
    password: z
      .string()
      .min(12, { message: "The password should have at least 12 characters" })
      .max(72, {
        message: "The password should be smaller than 72 characters",
      }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

type FormSchema = z.infer<typeof formSchema>;

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const resetPassword = useResetPassword();

  const onSubmit: SubmitHandler<FormSchema> = (data) =>
    resetPassword.mutate({
      token,
      ...data,
    });

  return (
    <div className="flex h-screen items-center justify-end bg-[url(/images/pombo-background.svg)] bg-center bg-repeat">
      <div className="absolute top-4 left-6 flex items-center gap-1 select-none sm:gap-2">
        <Image
          src="/images/logo.svg"
          alt="Pombo Logo"
          width={160}
          height={80}
        />
      </div>

      <div className="bg-light ring-smoke mx-4 flex flex-col gap-2 rounded-3xl p-4 ring-4 sm:mx-32 sm:min-w-md sm:gap-8 sm:p-8">
        {resetPassword.isSuccess ? (
          <>
            <div className="flex justify-center">
              <span className="material-symbols-outlined text-primary-400 text-6xl">
                check_circle
              </span>
            </div>
            <div className="flex w-full flex-col gap-0.5 text-center sm:gap-1.5">
              <h1 className="text-3xl font-bold sm:text-4xl">{`It's done`}</h1>
            </div>
            <div className="flex flex-col items-center gap-2 text-center sm:gap-3">
              <p className="max-w-sm text-gray-500">
                The password was successfully changed!
              </p>
            </div>
            <Link
              className="bg-primary-400 mx-7 rounded-full p-4 text-center font-bold text-white shadow-lg"
              href="/auth/sign_in"
            >
              Go back to sign in
            </Link>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-0.5 sm:gap-1.5">
              <div className="flex justify-center">
                <span className="material-symbols-outlined text-primary-400 text-6xl">
                  key
                </span>
              </div>
              <h1 className="text-3xl font-bold sm:text-4xl">Reset password</h1>
              <span className="text-gray-400">
                Enter the new password below
              </span>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-9"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="password"
                    className="text-dark pl-2 font-semibold"
                  >
                    Password
                  </Label>
                  <Input
                    {...register("password", {
                      required: true,
                    })}
                    className="bg-dark/5 border-0 placeholder:text-black/50"
                    type="password"
                    placeholder="Password"
                    id="password"
                  />
                  <span className="text-danger px-1">
                    {errors.password?.message}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="password_confirmation"
                    className="text-dark pl-2 font-semibold"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    {...register("password_confirmation", { required: true })}
                    className="bg-dark/5 border-0 placeholder:text-black/50"
                    type="password"
                    placeholder="Confirm Password"
                    id="password_confirmation"
                  />
                  <span className="text-danger px-1">
                    {errors.password_confirmation?.message}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <span className="text-danger px-1 text-center">
                  {resetPassword.isError &&
                    "Something went wrong, please try again."}
                </span>
                <button
                  className="bg-primary-400 mx-7 cursor-pointer rounded-full p-4 font-bold text-white shadow-lg"
                  type="submit"
                >
                  {resetPassword.isPending ? "Loading..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
