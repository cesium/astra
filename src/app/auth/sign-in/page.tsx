"use client";

import Input from "@/components/input";
import Label from "@/components/label";
import { useSignIn } from "@/lib/mutations/session";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import Image from "next/image";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

type FormSchema = z.infer<typeof formSchema>;

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const signIn = useSignIn();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    signIn.mutate(data, {
      onSuccess: () => {
        router.replace("/");
      },
    });
  };

  return (
    <div className="flex h-screen items-center justify-end bg-[url(/images/calendar.svg)] bg-center bg-repeat">
      <div className="absolute top-4 left-6 flex items-center gap-1 select-none sm:gap-2">
        <Image
          src="/images/logo.svg"
          alt="Pombo Logo"
          width={160}
          height={80}
        />
      </div>
      <div className="bg-light ring-smoke mx-4 flex flex-col gap-2 rounded-3xl p-4 ring-4 sm:mx-32 sm:min-w-md sm:gap-12 sm:p-8">
        <div className="flex flex-col gap-0.5 sm:gap-1.5">
          <h1 className="text-4xl font-semibold sm:text-4xl">
            Welcome! Sign in to Pombo
          </h1>
          <span className="text-gray-400">
            Acess your account to view all the info you need
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-9">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <Label htmlFor="email" className="text-dark pl-2 font-semibold">
                Email
              </Label>
              <Input
                {...register("email")}
                id="email"
                className="bg-dark/5 border-0 placeholder:text-black/50"
                placeholder="Email"
              />
              <span className="text-danger pl-2">{errors.email?.message}</span>
            </div>
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="password"
                className="text-dark pl-2 font-semibold"
              >
                Password
              </Label>

              <Input
                {...register("password")}
                id="password"
                className="bg-dark/5 border-0 placeholder:text-black/50"
                type="password"
                placeholder="Password"
              />
              <span className="text-danger pl-2">
                {errors.password?.message}
              </span>
            </div>
          </div>
          <div className="flex flex-col pl-2 sm:flex-row sm:gap-1">
            <span>Did you forget your password?</span>
            <Link
              href="/auth/forgot-password"
              className="text-primary-400 underline"
            >
              Click here
            </Link>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            {signIn.error && (
              <span className="text-danger px-1 text-center">
                {signIn.error.message}
              </span>
            )}
            <button
              className="bg-primary-400 mx-7 rounded-full p-4 font-bold text-white shadow-lg"
              type="submit"
            >
              {signIn.isPending ? "Loading..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
