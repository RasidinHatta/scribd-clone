"use client"

import { useActionState } from "react"
import { Button } from "../ui/button"
import { BsGoogle } from "react-icons/bs"
import { googleAuthenticate } from "@/actions/login"

const GoogleButton = () => {
  const [errorMsgGoogle, dispatchGoogle] = useActionState(googleAuthenticate, undefined)
  return (
    <form className="flex mt-4" action={dispatchGoogle}>
      <Button variant={"outline"} className="flex flex-row items-center gap-3 w-full">
        <BsGoogle />
        Sign In With Google
      </Button>
      <p>{errorMsgGoogle}</p>
    </form>
  )
}

export default GoogleButton