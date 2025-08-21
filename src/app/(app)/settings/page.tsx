'use client'

import Avatar from "@/components/avatar";
import Input from "@/components/input";
import Label from "@/components/label";
import { UserContext } from "@/contexts/user-provider";
import { use } from "react";

function Field({ user }: { user: string }) {
  return (
    <div className="flex justify-between items-center">
      <Label size="medium" className="text-dark/50">First and Last Name</Label>
      <Input placeholder={user}/>
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

        <section>
          <h2 className="text-2xl font-semibold">Information</h2>
          <div className="w-full max-w-3xl">
            <Field user={user?.name || "User Name"} />
          </div>
        </section>
      </div>
    );
}
