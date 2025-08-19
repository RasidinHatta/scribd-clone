import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    title: "Upload & Organize",
    description: "Easily upload documents and manage them with tags, folders, and version history.",
  },
  {
    title: "Read Anywhere",
    description: "Mobile-friendly viewer supports PDFs, DOCX, PPT, and more — no extra software needed.",
  },
  {
    title: "Share & Collaborate",
    description: "Control access, leave comments, and collaborate in real-time with your team or audience.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Study Archive</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl text-muted-foreground">
          Upload, read, and share documents seamlessly — your digital library, always accessible.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="text-background rounded-full px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <Link href="/register">
              Get Started
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-accent-foreground bg-foreground text-background"
          >
            <Link href="/community">
              Browse Documents
            </Link>
          </Button>
        </div>
      </section>

      {/* Separator */}
      <Separator className="my-12" />

      {/* Features Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Why Use Study Archive?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-sm border transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}