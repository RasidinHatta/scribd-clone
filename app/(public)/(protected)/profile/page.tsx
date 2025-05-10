"use server"
import { auth } from "@/auth"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TwoFactorToggle from "@/components/user/TwoFactorToggle "
import ChangeImageForm from "@/components/user/ChangeImageForm"

const ProfilePage = async () => {
  const session = await auth()
  const { user } = session || {}  // Destructuring session for cleaner access
  const imageSrc = user?.image || "https://github.com/shadcn.png"

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center md:flex-row md:items-stretch gap-6">
      {/* Left card: Profile image */}
      <Card className="w-full max-w-xs bg-muted-foreground text-background flex-grow">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt="Profile Picture"
              width={150}
              height={150}
              className="rounded-full border-2 border-border"
            />
          ) : (
            <div className="w-[150px] h-[150px] rounded-full bg-muted-foreground flex items-center justify-center text-foreground">
              No Image
            </div>
          )}
        </CardContent>
        {/* Button to change the image */}
        <CardContent className="flex justify-center">
          <ChangeImageForm/>
        </CardContent>
      </Card>

      {/* Right card: Info */}
      <Card className="w-full max-w-xl bg-muted-foreground text-background flex-grow">
        <CardHeader>
          <CardTitle>Welcome, {user?.name}!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="space-y-2">
            {user && (
              <>
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.name || ""}
                    className="w-full px-3 py-2 rounded bg-background text-foreground border border-border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ""}
                    className="w-full px-3 py-2 rounded bg-background text-foreground border border-border"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="block text-sm font-medium">Two-Factor</label>
                  <TwoFactorToggle initialValue={!!user?.twoFactorEnabled} />
                </div>

                {user?.emailVerified && (
                  <div>
                    <label className="block text-sm font-medium">Email Verified</label>
                    <input
                      type="text"
                      readOnly
                      value={new Date(user.emailVerified).toLocaleString()}
                      className="w-full px-3 py-2 rounded bg-background text-foreground border border-border"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
