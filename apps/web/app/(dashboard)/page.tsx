
"use client"
import { useMutation, useQuery, Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@workspace/ui/components/button";
import { api } from "@workspace/backend/_generated/api";
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";
export default function Page() {
  const users = useQuery(api.users.getMany)
  const addUser = useMutation(api.users.add)
  return (
    <>

      <div className="flex items-center justify-center min-h-svh">

        <div className="max-w-sm w-full mx-auto">
          <p>apps/web</p>
          <UserButton/>
          <OrganizationSwitcher hidePersonal/>
          <Button onClick={() => addUser()}>Add</Button>
          {JSON.stringify(users, null, 2)}</div>

      </div>

      <p>Must be sign In</p>
      <SignInButton>Sign </SignInButton>

    </>
  )
}
