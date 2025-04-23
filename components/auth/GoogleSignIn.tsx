import { signIn } from "@/auth"
import { Button } from "../ui/button"
import { FaGoogle } from "react-icons/fa"

export default function GoogleSignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/" })
      }}
    >
      <Button className="w-full flex items-center justify-center" type="submit">
        <FaGoogle className="mr-2" /> {/* Google logo */}
        Sign In With Google
      </Button>
    </form>
  )
}
