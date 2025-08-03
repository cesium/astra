"use client";
import Input from "@/components/input";
import Label from "@/components/label";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  email: z.email(),
});

type FormSchema = z.infer<typeof formSchema>;

enum ResponseStatus {
  Empty,
  Loading,
  Success,
  Error,
}

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const [status, setStatus] = useState<ResponseStatus>(ResponseStatus.Empty);

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    try {
      setStatus(ResponseStatus.Loading);
      await api.post("/auth/forgot_password", data);
      setStatus(ResponseStatus.Success);
    } catch {
      setStatus(ResponseStatus.Error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-end bg-[url(/images/calendar.svg)] bg-repeat bg-center">
      <div className="absolute left-6 top-4 flex items-center gap-1 sm:gap-2 select-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-bird-icon lucide-bird stroke-primary-400 size-14"
        >
          <path d="M16 7h.01" />
          <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
          <path d="m20 7 2 .5-2 .5" />
          <path d="M10 18v3" />
          <path d="M14 17.75V21" />
          <path d="M7 18a6 6 0 0 0 3.84-10.61" />
        </svg>
        <span className="text-3xl font-bold">pombo</span>
      </div>
      <div className="mx-4 sm:mx-32 flex flex-col gap-2 p-4 ring-4 bg-light ring-smoke sm:min-w-md sm:gap-12 sm:p-8 rounded-3xl">
        <div className="flex flex-col items-center gap-0.5 text-center sm:gap-1.5">
          <h1 className="text-3xl font-bold sm:text-4xl">Forgot password</h1>
          <div className="flex flex-col items-center">

            <span className="max-w-72 text-gray-400">
              Did you forget your password?
            </span>
            <span className="text-gray-400">
              Try entering your email here to reset your password
            </span>
          </div>
        </div>
        {status === ResponseStatus.Success ? (
          <>
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary-400 text-6xl">
                check_circle
              </span>
              <p className="max-w-2xs text-gray-500">
                If your account exists, an email was sent to your inbox with the
                link to reset your password.
              </p>
            </div>
            <Link
              className="bg-primary-400 mx-7 text-center rounded-full shadow-lg p-4 font-bold text-white"
              href="/auth/sign_in"
            >
              Go back to sign in
            </Link>
          </>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-9"
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="email" className="text-dark font-semibold pl-2">
                Email
              </Label>
              <Input
                {...register("email", { required: true })}
                className="bg-dark/5 placeholder:text-black/50 border-0"
                id="email"
                placeholder="Email"
              />
              <span className="text-danger px-1">
                {errors.email?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1 sm:gap-2">

              <span className="text-center text-danger px-1">
                {status === ResponseStatus.Error && "Something went wrong, please try again."}
              </span>
              <button
                className="bg-primary-400 mx-7 rounded-full shadow-lg p-4 font-bold text-white"
                type="submit"
              >
                {status === ResponseStatus.Loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
