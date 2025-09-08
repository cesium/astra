"use client";

import Input from "@/components/input";
import Label from "@/components/label";
import { useForgotPassword } from "@/lib/mutations/session";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  email: z.email(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const forgotPassword = useForgotPassword();

  const onSubmit: SubmitHandler<FormSchema> = (data) =>
    forgotPassword.mutate(data);

  return (
    <div className="flex h-screen items-center justify-end bg-[url(/images/calendar.svg)] bg-center bg-repeat">
      <div className="absolute top-4 left-6 flex items-center gap-1 select-none sm:gap-2">
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
      <div className="bg-light ring-smoke mx-4 flex flex-col gap-2 rounded-3xl p-4 ring-4 sm:mx-32 sm:min-w-md sm:gap-12 sm:p-8">
        <div className="flex w-full flex-col gap-0.5 sm:gap-1.5">
          <h1 className="text-3xl font-bold sm:text-4xl">Forgot password</h1>
          <div className="flex flex-col">
            <span className="max-w-72 text-gray-400">
              Did you forget your password?
            </span>
            <span className="text-gray-400">
              Try entering your email here to reset your password
            </span>
          </div>
        </div>
        {forgotPassword.isSuccess ? (
          <>
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="material-symbols-outlined text-primary-400 text-6xl">
                check_circle
              </span>
              <p className="max-w-sm text-gray-500">
                If your account exists, an email was sent to your inbox with the
                link to reset your password.
              </p>
            </div>
            <Link
              className="bg-primary-400 mx-7 rounded-full p-4 text-center font-bold text-white shadow-lg"
              href="/auth/sign-in"
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
              <Label htmlFor="email" className="text-dark pl-2 font-semibold">
                Email
              </Label>
              <Input
                {...register("email", { required: true })}
                className="bg-dark/5 border-0 placeholder:text-black/50"
                id="email"
                placeholder="Email"
              />
              <span className="text-danger px-1">{errors.email?.message}</span>
            </div>
            <div className="flex flex-col gap-1 sm:gap-2">
              <span className="text-danger px-1 text-center">
                {forgotPassword.isError &&
                  "Something went wrong, please try again."}
              </span>
              <button
                className="bg-primary-400 mx-7 rounded-full p-4 font-bold text-white shadow-lg"
                type="submit"
              >
                {forgotPassword.isPending ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
