import { ForceDarkMode } from "@/components/theme/ForceDarkMode"
import React, { Suspense } from "react"
import Image from "next/image"

const AdminAuthLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const source = "/background/adminAuthBackground"
  const avifSource = `${source}.avif`
  const webpSource = `${source}.webp`

  return (
    <section className="relative min-h-screen w-full dark">
      {/* Background with optimized Next.js Image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <picture>
          <source srcSet={avifSource} type="image/avif" />
          <source srcSet={webpSource} type="image/webp" />
          <Image
            src={avifSource}
            alt="Abstract background"
            className="h-full w-full object-cover"
            fill
            priority={false}
            quality={80}
            sizes="100vw"
          />
        </picture>
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[4px]" />
      </div>

      {/* Centered content */}
      <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl rounded-xl shadow-2xl p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <ForceDarkMode>{children}</ForceDarkMode>
          </Suspense>
        </div>
      </div>
    </section>
  )
}

export default AdminAuthLayout