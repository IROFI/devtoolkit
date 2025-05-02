"use client";

import { MainNav } from "@/components/main-nav";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

// Nouvelle structure toolCategories avec items détaillés
const toolCategories = [
  {
    title: "Security & Encoding",
    items: [
      {
        name: "Text Hasher",
        href: "/tools/security/hasher",
        description: "Hash text with various algorithms.",
      },
      {
        name: "JWT Encoder/Decoder",
        href: "/tools/security/jwt",
        description: "Encode and decode JWT tokens.",
      },
      {
        name: "Password Strength",
        href: "/tools/security/password-strength",
        description: "Check password strength.",
      },
      {
        name: "Password Generator",
        href: "/tools/security/password-generator",
        description: "Generate secure passwords.",
      },
    ],
  },
  {
    title: "Data & Conversion",
    items: [
      {
        name: "JSON ↔ YAML",
        href: "/tools/conversion/json-yaml",
        description: "Convert between JSON and YAML.",
      },
      {
        name: "JSON ↔ CSV",
        href: "/tools/conversion/json-csv",
        description: "Convert between JSON and CSV.",
      },
      {
        name: "Base64 Encoder/Decoder",
        href: "/tools/conversion/base64",
        description: "Encode/decode Base64.",
      },
      {
        name: "URL Encoder/Decoder",
        href: "/tools/conversion/url",
        description: "Encode/decode URLs.",
      },
      {
        name: "Image Converter",
        href: "/tools/conversion/image-converter",
        description: "Convert images between formats.",
      },
      {
        name: "Text Diff Checker",
        href: "/tools/conversion/text-diff",
        description: "Compare text differences.",
      },
      {
        name: "Character Counter",
        href: "/tools/conversion/character-counter",
        description: "Count characters in text.",
      },
      {
        name: "Lorem Ipsum Generator",
        href: "/tools/conversion/lorem-ipsum",
        description: "Generate placeholder text.",
      },
    ],
  },
  {
    title: "Web & Dev Tools",
    items: [
      {
        name: "Timestamp Converter",
        href: "/tools/web/timestamp",
        description: "Convert timestamps to dates.",
      },
      {
        name: "JSON Formatter",
        href: "/tools/web/json-formatter",
        description: "Format JSON data.",
      },
      {
        name: "Regex Tester",
        href: "/tools/web/regex",
        description: "Test regular expressions.",
      },
      {
        name: "HTTP Request Tester",
        href: "/tools/web/http-request",
        description: "Test HTTP requests.",
      },
      {
        name: "Link Previewer",
        href: "/tools/web/link-preview",
        description: "Preview web links.",
      },
      {
        name: "CSS Minifier",
        href: "/tools/web/css-minifier",
        description: "Minify CSS code.",
      },
      {
        name: "CSS / Tailwind Unit Converter",
        href: "/tools/web/css-tailwind-unit-converter",
        description: "Convert CSS units.",
      },
    ],
  },
  {
    title: "Visual & UI Tools",
    items: [
      {
        name: "Color Picker",
        href: "/tools/visual/color-picker",
        description: "Pick colors visually.",
      },
      {
        name: "Color Palette Generator",
        href: "/tools/visual/color-palet-generator",
        description: "Generate color palettes.",
      },
      {
        name: "CSS Gradient Generator",
        href: "/tools/visual/gradient-generator",
        description: "Create CSS gradients.",
      },
      {
        name: "Box Shadow",
        href: "/tools/visual/box-shadow",
        description: "Generate CSS box shadows.",
      },
      {
        name: "Grid Layout Generator",
        href: "/tools/visual/grid-layout-generator",
        description: "Create CSS grid layouts.",
      },
      {
        name: "Markdown Previewer",
        href: "/tools/visual/markdown",
        description: "Preview Markdown.",
      },
      {
        name: "Image to Base64",
        href: "/tools/visual/image-base64",
        description: "Convert images to Base64.",
      },
      {
        name: "Image Compressor",
        href: "/tools/visual/image-compressor",
        description: "Compress images.",
      },
      {
        name: "Sprite Generator",
        href: "/tools/visual/sprite-generator",
        description: "Generate image sprites.",
      },
    ],
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  // On aplatit tous les items pour la recherche
  const allTools = toolCategories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.title,
    }))
  );

  // Filtrage sur le nom, la catégorie ou la description
  const filteredTools = allTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.description &&
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-4">
        <section className="py-6 md:py-4 lg:py-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            DevToolkit
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of essential tools for developers to streamline your
            workflow. All tools work directly in your browser with no data sent
            to servers.
          </p>
          <div className="mt-4">
            <SearchBar onSearch={setSearchTerm} />
          </div>
        </section>

        <section className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <Card key={tool.href} className="h-full">
              <CardHeader>
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>
                  <span className="block font-semibold">{tool.category}</span>
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={tool.href}>Ouvrir l'outil</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          {filteredTools.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              Aucun outil trouvé.
            </div>
          )}
        </section>

        <section className="py-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Fast, Reliable & Secure
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All tools run entirely in your browser. No data is sent to any
            server. Your information stays private and secure, and tools work
            even offline.
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
