"use client";
import Card from "@/components/card";
import Input from "@/components/input";
import Label from "@/components/label";
import { apiWithCredentials } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required")
})

type FormSchema = z.infer<typeof formSchema>

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setLoading(true);

    try {
      const res = await apiWithCredentials.post("/auth/sign_in", data);
      const { access_token } = res.data;

      useAuthStore.getState().setToken(access_token);
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.status === 401) {
          setError("Incorrect email or password");
        } else {
          setError("Login unavailable at the moment. Please try again shortly.");
        }
      } else {
        setError("Something went wrong");
      }

      setLoading(false);
      console.error("Login failed:", error);
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

          <h1 className="text-4xl font-semibold sm:text-4xl">Welcome! Sign in to Pombo</h1>
          <span className="text-gray-400">
            Acess your account to view all the info you need
          </span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-9"
        >
          <div className="flex flex-col gap-6">

            <div className="flex flex-col gap-1">
              <Label htmlFor="email" className="text-dark font-semibold pl-2">
                Email
              </Label>
              <Input
                {...register("email")}
                id="email"
                className="bg-dark/5 placeholder:text-black/50"
                placeholder="Email"
              />
              <span className="text-danger pl-2">
                {errors.email?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="password" className="text-dark font-semibold pl-2">
                Password
              </Label>

              <Input
                {...register("password")}
                id="password"
                className="bg-dark/5 placeholder:text-black/50"
                type="password"
                placeholder="Password"
              />
              <span className="text-danger pl-2">
                {errors.password?.message}
              </span>
            </div>
          </div>
          <div className="flex justify-center gap-1">
            <span>Did you forget your password?</span>
            <Link
              href="/auth/forgot_password"
              className="text-primary-400 underline"
            >
              Click here
            </Link>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">

            <span className="text-center text-danger px-1">
              {error}
            </span>
            <button
              className="bg-primary-400 mx-7 rounded-full shadow-lg p-4 font-bold text-white"
              type="submit"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
