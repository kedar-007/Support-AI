
"use client"
import { useMutation, useQuery } from "convex/react";
import { Button } from "@workspace/ui/components/button";
import { api } from "@workspace/backend/_generated/api";
export default function Page() {
  const users = useQuery(api.users.getMany)
  const addUser = useMutation(api.users.add)
  return (
    <div className="flex items-center justify-center min-h-svh">

      <div className="max-w-sm w-full mx-auto">
        <p>apps/widget</p>
        <Button onClick={() => addUser()}>Add</Button>
        {JSON.stringify(users, null, 2)}</div>

    </div>
  )
}
