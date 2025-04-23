"use server"
import { auth } from "@/auth"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

const ProfilePage = async () => {
  const session = await auth()

  if (!session) redirect("/")

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md ml-10"> {/* Align card to the left */}
        <CardHeader>
          <CardTitle>Welcome, {session?.user?.name}!</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile Picture"
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
          <div>
            <p className="text-lg font-semibold">{session?.user?.name}</p>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage