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
    <>
      <title>Pombo | Sign In</title>
      <div className="flex h-screen flex-col overflow-hidden bg-center bg-repeat sm:h-screen sm:flex-row sm:items-center sm:justify-end sm:overflow-visible md:bg-[url(/images/pombo-background.svg)]">
        <div className="flex h-16 items-center bg-white sm:hidden">
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

        <div className="h-28 bg-[url(/images/pombo-stripe.svg)] bg-cover bg-center sm:hidden"></div>

        <div className="bg-light ring-smoke flex min-h-0 flex-1 flex-col gap-2 p-4 ring-4 sm:relative sm:mx-32 sm:h-auto sm:min-w-md sm:flex-none sm:gap-12 sm:rounded-3xl sm:p-8">
          <div className="flex flex-col gap-0.5 sm:gap-1.5">
            <h1 className="text-4xl font-semibold sm:text-4xl">
              Welcome! Sign in to Pombo
            </h1>
            <span className="text-gray-400">
              Access your account to view all the info you need
            </span>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-9"
          >
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
                <span className="text-danger pl-2">
                  {errors.email?.message}
                </span>
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
                href="/auth/forgot_password"
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
                className="bg-primary-400 mx-7 cursor-pointer rounded-full p-4 font-bold text-white shadow-lg"
                type="submit"
              >
                {signIn.isPending ? "Loading..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
