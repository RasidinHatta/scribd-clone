"use client";

import CommunityPage from "@/components/CommunityPage";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator"; // Import the Separator component
import { SignOut } from "@/components/auth/SignOut";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default function Home() {
  const communityRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToCommunity = () => {
    if (communityRef.current) {
      communityRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <SignOutButton />
      <section className="h-screen flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to SAMS</h1>
        <p className="text-xl mb-6 max-w-2xl">
          Upload, read, and share documents seamlessly — your digital library, always accessible.
        </p>
        <div className="flex gap-4">
          {/* Get Started Button */}
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 rounded-full font-semibold text-foreground bg-background border border-foreground hover:bg-accent-foreground hover:text-primary transition"
          >
            Get Started
          </button>

          {/* Browse Documents Button */}
          <button
            onClick={scrollToCommunity}
            className="bg-transparent border border-foreground px-6 py-2 rounded-full font-semibold text-foreground hover:bg-accent-foreground hover:text-primary transition"
          >
            Browse Documents
          </button>
        </div>
      </section>

      {/* Separator between Hero and Features Section */}
      <Separator className="my-12 h-10" />

      {/* Features Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-10">Why Use SAMS?</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-muted-foreground p-6 shadow-lg rounded-lg text-background">
            <h3 className="text-2xl font-semibold mb-3">Upload & Organize</h3>
            <p>
              Easily upload documents and manage them with tags, folders, and version history.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-muted-foreground p-6 shadow-lg rounded-lg text-background">
            <h3 className="text-2xl font-semibold mb-3">Read Anywhere</h3>
            <p>
              Mobile-friendly viewer supports PDFs, DOCX, PPT, and more — no extra software needed.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-muted-foreground p-6 shadow-lg rounded-lg text-background">
            <h3 className="text-2xl font-semibold mb-3">Share & Collaborate</h3>
            <p>
              Control access, leave comments, and collaborate in real-time with your team or audience.
            </p>
          </div>
        </div>
      </section>

      {/* Separator between Features and Community Page Section */}
      <Separator className="my-12 h-10" />

      {/* Community Page Section */}
      <div ref={communityRef}>
        <CommunityPage />
      </div>
    </>
  );
}