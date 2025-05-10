"use server"
import { auth } from "@/auth"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TwoFactorToggle from "./user/TwoFactorToggle "

const ProfilePage = async () => {
  const session = await auth()
  const imageSrc = session?.user?.image || "https://github.com/shadcn.png"

  return (
    <div className="min-h-screen bg-background p-6 flex justify-center items-start">
      <Card className="w-full max-w-4xl bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Welcome, {session?.user?.name || "User"}!</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center justify-center w-full md:w-1/3">
              <Image
                src={imageSrc}
                alt="Profile Picture"
                width={150}
                height={150}
                className="rounded-full border-2 border-border"
              />
            </div>

            {/* User Information Section */}
            <div className="w-full md:w-2/3 space-y-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-foreground">Name</label>
                <input
                  type="text"
                  readOnly
                  value={session?.user?.name || ""}
                  className="w-full px-3 py-2 rounded bg-input text-input-foreground border border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  readOnly
                  value={session?.user?.email || ""}
                  className="w-full px-3 py-2 rounded bg-input text-input-foreground border border-border"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="block text-sm font-medium text-foreground">Two-Factor</label>
                <TwoFactorToggle initialValue={!!session?.user?.twoFactorEnabled} />
              </div>

              {session?.user?.emailVerified && (
                <div>
                  <label className="block text-sm font-medium text-foreground">Email Verified</label>
                  <input
                    type="text"
                    readOnly
                    value={new Date(session.user.emailVerified).toLocaleString()}
                    className="w-full px-3 py-2 rounded bg-input text-input-foreground border border-border"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
