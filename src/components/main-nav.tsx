"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const toolCategories = [
  {
    title: "Security & Encoding",
    items: [
      { name: "Text Hasher", href: "/tools/security/hasher" },
      { name: "JWT Encoder/Decoder", href: "/tools/security/jwt" },
      { name: "Password Strength", href: "/tools/security/password-strength" },
      { name: "Password Generator", href: "/tools/security/password-generator" },
    ],
  },
  {
    title: "Data & Conversion",
    items: [
      { name: "JSON ↔ YAML", href: "/tools/conversion/json-yaml" },
      { name: "JSON ↔ CSV", href: "/tools/conversion/json-csv" },
      { name: "Base64 Encoder/Decoder", href: "/tools/conversion/base64" },
      { name: "URL Encoder/Decoder", href: "/tools/conversion/url" },
    ],
  },
  {
    title: "Web & Dev Tools",
    items: [
      { name: "Timestamp Converter", href: "/tools/web/timestamp" },
      { name: "JSON Formatter", href: "/tools/web/json-formatter" },
      { name: "Regex Tester", href: "/tools/web/regex" },
      { name: "HTTP Request Tester", href: "/tools/web/http-request" },
    ],
  },
  {
    title: "Visual & UI Tools",
    items: [
      { name: "Color Picker", href: "/tools/visual/color-picker" },
      { name: "CSS Gradient Generator", href: "/tools/visual/gradient-generator" },
      { name: "Markdown Previewer", href: "/tools/visual/markdown" },
      { name: "Image to Base64", href: "/tools/visual/image-base64" },
    ],
  },
];

export function MainNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between py-4 md:py-6 px-4 md:px-6 border-b w-full bg-background">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="hidden sm:inline">DevToolkit</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {toolCategories.map((category) => (
            <div key={category.title} className="relative group">
              <span className="text-sm font-medium cursor-pointer hover:text-primary">
                {category.title}
              </span>
              <div className="absolute left-0 top-full hidden group-hover:block z-10 bg-background border rounded-md shadow-md p-2 w-56">
                <div className="grid gap-1">
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-2 py-1 text-sm rounded-md hover:bg-secondary transition-colors",
                        pathname === item.href
                          ? "bg-secondary font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <div className="flex flex-col gap-6 pt-6">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-lg"
                onClick={closeMobileMenu}
              >
                DevToolkit
              </Link>

              <nav className="flex flex-col gap-4">
                {toolCategories.map((category) => (
                  <div key={category.title} className="space-y-2">
                    <h4 className="font-medium text-sm">{category.title}</h4>
                    <div className="grid gap-1">
                      {category.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            "block px-2 py-1 text-sm rounded-md hover:bg-secondary transition-colors",
                            pathname === item.href
                              ? "bg-secondary font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
