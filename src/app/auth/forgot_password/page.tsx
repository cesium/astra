"use client";

import Input from "@/components/input";
import Label from "@/components/label";
import { useForgotPassword } from "@/lib/mutations/session";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import Image from "next/image";

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
    <div className="flex h-screen items-center justify-end bg-[url(/images/pombo-background.svg)] bg-center bg-repeat sm:flex sm:h-screen sm:items-center sm:justify-end">
      <div className="absolute top-0 right-0 left-0 flex h-16 items-center bg-white sm:hidden">
        <div className="relative left-6 flex items-center gap-1 select-none">
          <Image
            src="/images/logo.svg"
            alt="Pombo Logo"
            width={120}
            height={60}
          />
        </div>
      </div>

      <div className="absolute top-4 left-6 z-10 hidden items-center gap-1 select-none sm:flex sm:gap-2">
        <Image
          src="/images/logo.svg"
          alt="Pombo Logo"
          width={160}
          height={80}
        />
      </div>

      <div className="bg-light ring-smoke fixed right-0 bottom-0 left-0 flex h-[80vh] flex-col gap-2 p-4 ring-4 sm:relative sm:mx-32 sm:h-auto sm:min-w-md sm:gap-12 sm:rounded-3xl sm:p-8">
        {forgotPassword.isSuccess ? (
          <>
            <div className="flex justify-center">
              <span className="material-symbols-outlined text-primary-400 text-6xl">
                check_circle
              </span>
            </div>
            <div className="flex w-full flex-col gap-0.5 text-center sm:gap-1.5">
              <h1 className="text-3xl font-bold sm:text-4xl">
                Check your email
              </h1>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="max-w-sm text-gray-500">
                If your account exists, an email was sent to your inbox with the
                link to reset your password.
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
            <div className="flex flex-col">
              <Link
                href="/auth/sign_in"
                className="text-primary-400 hover:text-primary-500 flex w-fit items-center gap-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                <span>Back</span>
              </Link>
              <div className="flex justify-center">
                <span className="material-symbols-outlined text-primary-400 text-6xl">
                  key
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-0.5 sm:gap-1.5">
              <h1 className="text-3xl font-bold sm:text-4xl">
                Forgot password
              </h1>
              <div className="flex flex-col">
                <span className="max-w-72 text-gray-400">
                  Did you forget your password?
                </span>
                <span className="text-gray-400">
                  Try entering your email here to reset your password
                </span>
              </div>
            </div>
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
                <span className="text-danger px-1">
                  {errors.email?.message}
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <span className="text-danger px-1 text-center">
                  {forgotPassword.isError &&
                    "Something went wrong, please try again."}
                </span>
                <button
                  className="bg-primary-400 mx-7 cursor-pointer rounded-full p-4 font-bold text-white shadow-lg"
                  type="submit"
                >
                  {forgotPassword.isPending ? "Loading..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
