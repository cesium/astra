"use client";
import Card from "@/components/card";
import Input from "@/components/input";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
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
    <div className="flex h-screen items-center justify-center">
      <div className="mx-4 flex flex-col items-center gap-4 sm:gap-7">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 sm:gap-2">
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
          <span>always at hand.</span>
        </div>
        <Card className="flex flex-col gap-2 p-4 sm:min-w-md sm:gap-6 sm:p-8">
          <div className="flex flex-col items-center gap-0.5 text-center sm:gap-1.5">
            <h2 className="text-3xl font-bold sm:text-4xl">Forgot password</h2>
            <span className="max-w-72 text-gray-400">
              Did you forget your password?
            </span>
            <span className="text-gray-400">
              Try entering your email here to reset your password
            </span>
          </div>
          {status === ResponseStatus.Success ? (
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary-400 text-6xl">
                check_circle
              </span>
              <p className="max-w-3xs text-gray-700">
                If your account exists, an email was sent to your inbox with the
                link to reset your password.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-dark pl-1 font-medium">
                  Email
                </label>
                <Input
                  {...register("email", { required: true })}
                  className="bg-muted/70"
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
                  className="from-primary-400 to-primary-500 mx-7 rounded-xl bg-gradient-to-br p-4 font-bold text-white"
                  type="submit"
                >
                  {status === ResponseStatus.Loading ? "Loading..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </Card>
        <span className="text-center text-gray-400">
          © 2025 Pombo • University schedule management made simple
        </span>
      </div>
      <div className="absolute inset-0 -z-10 h-screen w-screen overflow-hidden">
        <div className="absolute inset-0 -z-10 backdrop-blur-3xl" />
        <div className="bg-primary-400/15 absolute inset-0 -z-20 size-full" />
        <div className="from-primary-400/35 to-primary-400/5 absolute top-1/2 left-0 -z-20 h-10/12 w-2/6  md:size-[738px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial" />
        <div className="from-primary-400/35 to-primary-400/5 absolute top-1/2 right-0 -z-20 h-10/12 w-2/6 md:size-[738px] translate-x-1/2 -translate-y-1/2 rounded-full bg-radial" />
      </div>
    </div>
  );
}
