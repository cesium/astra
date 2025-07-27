"use client";
import Card from "@/components/card";
import Input from "@/components/input";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface IFormInput {
  password: string;
  password_confirmation: string;
}

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "The password should have at least 12 characters" })
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

enum ResponseStatus {
  Empty,
  Loading,
  Success,
  Error,
}

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<ResponseStatus>(ResponseStatus.Empty);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    try {
      setStatus(ResponseStatus.Loading);
      await api.post("/auth/reset_password", {
        token,
        ...data,
      });
      setStatus(ResponseStatus.Success);
    } catch (error) {
      console.log(error);
      setStatus(ResponseStatus.Error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-7">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
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
        <Card className="flex min-w-md flex-col gap-6 p-8">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-4xl font-bold">Reset password</span>
            <span className="text-gray-400">
              Access your account to view all the info you need
            </span>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-dark pl-1 font-medium">
                Password
              </label>
              <Input
                {...register("password", {
                  required: true,
                })}
                className="bg-muted/70"
                type="password"
                placeholder="Password"
              />
              <span className="text-danger px-1">
                {errors.password?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirm_password"
                className="text-dark pl-1 font-medium"
              >
                Confirm Password
              </label>
              <Input
                {...register("password_confirmation", { required: true })}
                className="bg-muted/70"
                type="password"
                placeholder="Confirm Password"
              />
              <span className="text-danger px-1">
                {errors.password_confirmation?.message}
              </span>
            </div>
            <button
              className="from-primary-400 to-primary-500 mx-7 rounded-xl bg-gradient-to-br p-4 font-bold text-white"
              type="submit"
            >
              {status === ResponseStatus.Loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </Card>
        <span className="text-gray-400">
          © 2025 Pombo • University schedule management made simple
        </span>
      </div>
      <div className="absolute inset-0 -z-10 h-screen w-screen overflow-hidden">
        <div className="absolute inset-0 -z-10 backdrop-blur-3xl" />
        <div className="bg-primary-400/15 absolute inset-0 -z-20 size-full" />
        <div className="from-primary-400/35 to-primary-400/5 absolute top-1/2 left-0 -z-20 size-[738px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial" />
        <div className="from-primary-400/35 to-primary-400/5 absolute top-1/2 right-0 -z-20 size-[738px] translate-x-1/2 -translate-y-1/2 rounded-full bg-radial" />
      </div>
    </div>
  );
}
