"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { updateUserInfo } from "@/actions/user"
import { ProfileSchema } from "@/lib/schemas"
import ChangeImageForm from "@/components/user/ChangeImageForm"
import { Switch } from "@/components/ui/switch"

const ProfilePage = () => {
  const { data: session, status } = useSession()
  const user = session?.user
  const imageSrc = user?.image

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      twoFactorEnabled: false,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Reset form when session is loaded
  useEffect(() => {
    if (status === "authenticated" && user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        twoFactorEnabled: user.twoFactorEnabled || false,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [user, status, form])

  const onSubmit = async (data: z.infer<typeof ProfileSchema>) => {
    setLoading(true)

    // Only include password fields if they're provided
    const updateData = {
      name: data.name,
      email: data.email,
      twoFactorEnabled: data.twoFactorEnabled,
      ...(data.currentPassword && { currentPassword: data.currentPassword }),
      ...(data.newPassword && { newPassword: data.newPassword }),
    }

    const res = await updateUserInfo(updateData)

    if (res.error) {
      toast.error(res.error)
    } else if (res.success) {
      toast.success(res.success)
      // Clear password fields on success
      form.reset({
        ...form.getValues(),
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-background text-foreground">
      <div className="w-full max-w-5xl md:flex gap-6">
        {/* Profile Image Card */}
        <Card className="w-full md:w-1/3 mb-6 md:mb-0 bg-card text-card-foreground">
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
                className="rounded-full object-cover w-[150px] h-[150px] border"
              />
            ) : (
              <Image
                src="/avatars/shadcn.jpeg"
                alt="Profile Picture"
                width={150}
                height={150}
                className="rounded-full object-cover w-[150px] h-[150px] border"
              />
            )}
          </CardContent>
          <CardContent className="flex justify-center">
            <ChangeImageForm />
          </CardContent>
        </Card>

        {/* Profile Info Form Card */}
        <Card className="w-full md:w-2/3 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Profile : {user?.name}</CardTitle>
            <CardDescription>Edit your profile information below</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Two-Factor</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password (only if changing password)</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password (optional)</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password (if changing password)</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="text-[#171717]"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage