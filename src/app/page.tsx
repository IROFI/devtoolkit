import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function Home() {
  const toolCategories = [
    {
      title: "Security & Encoding",
      description: "Hash text, encode/decode JWT, check password strength, and generate secure passwords.",
      href: "/tools/security/hasher",
      iconClass: "i-lucide-shield",
    },
    {
      title: "Data & Conversion",
      description: "Convert between JSON, YAML, CSV formats, and encode/decode Base64 and URLs.",
      href: "/tools/conversion/json-yaml",
      iconClass: "i-lucide-file-json",
    },
    {
      title: "Web & Dev Tools",
      description: "Convert timestamps, format JSON, test regex patterns, and try HTTP requests.",
      href: "/tools/web/timestamp",
      iconClass: "i-lucide-code",
    },
    {
      title: "Visual & UI Tools",
      description: "Pick colors, generate CSS gradients, preview Markdown, and convert images to Base64.",
      href: "/tools/visual/color-picker",
      iconClass: "i-lucide-palette",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <section className="py-12 md:py-16 lg:py-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            DevToolkit
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of essential tools for developers to streamline your workflow.
            All tools work directly in your browser with no data sent to servers.
          </p>
        </section>

        <section className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {toolCategories.map((category) => (
            <Card key={category.title} className="h-full">
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={category.href}>Explore Tools</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>

        <section className="py-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Fast, Reliable & Secure</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All tools run entirely in your browser. No data is sent to any server.
            Your information stays private and secure, and tools work even offline.
          </p>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DevToolkit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
