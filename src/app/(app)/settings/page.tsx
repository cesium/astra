'use client'

import Avatar from "@/components/avatar";
import Input from "@/components/input";
import Label from "@/components/label";
import { UserContext } from "@/contexts/user-provider";
import { use } from "react";

interface IInputLineProps {
  label: string;
  value: string;
}

function InputLine({ label, value }: IInputLineProps) {
  return (
    <div className="flex justify-between items-center">
      <Label size="large" className="text-dark/50">{label}</Label>
      <Input disabled placeholder={value} className="flex-1 max-w-lg"/>
    </div>
  )
}

export default function Account() {
  
  const { user } = use(UserContext);
  
  return (
      <div className="space-y-10">
        <title>Pombo | Account</title>

        <section className="flex gap-7.5">
          <Avatar name={user?.name || "User Name"} className="size-40"/>
          <div className="pt-3.5 space-y-1">
            <h2 className="text-3xl font-semibold text-dark">{user?.name || "User Name"}</h2>
            <p className="font-semibold">{user?.email || "user@example.com"}</p>
          </div>
        </section>

        <section className="space-y-3.5">
          <h2 className="text-2xl font-semibold">Information</h2>
          <div className="flex flex-col gap-1.5 w-full max-w-3xl">
            <InputLine label="Full Name" value={user?.name || "User Name"} />
            <InputLine label="Email" value={user?.email || "a145236@alunos.uminho.pt"} />
            <InputLine label="Student Number" value={"a145236"} />
            <InputLine label="Course" value={"Licenciatura em Engenharia Informática"} />
            <InputLine label="Year" value={"1st Year"} />
            <InputLine label="Statute" value={"No"} />

          </div>
        </section>
      </div>
    );
}
