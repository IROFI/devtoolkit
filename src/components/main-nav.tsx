"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const toolCategories = [
  {
    title: "Security & Encoding",
    items: [
      { name: "Text Hasher", href: "/tools/security/hasher" },
      { name: "JWT Encoder/Decoder", href: "/tools/security/jwt" },
      { name: "Password Strength", href: "/tools/security/password-strength" },
      {
        name: "Password Generator",
        href: "/tools/security/password-generator",
      },
    ],
  },
  {
    title: "Data & Conversion",
    items: [
      { name: "JSON ↔ YAML", href: "/tools/conversion/json-yaml" },
      { name: "JSON ↔ CSV", href: "/tools/conversion/json-csv" },
      { name: "Base64 Encoder/Decoder", href: "/tools/conversion/base64" },
      { name: "URL Encoder/Decoder", href: "/tools/conversion/url" },
      { name: "Image Converter", href: "/tools/conversion/image-converter" },
      { name: "Text Diff Checker", href: "/tools/conversion/text-diff" },
      {
        name: "Character Counter",
        href: "/tools/conversion/character-counter",
      },
      { name: "Lorem Ipsum Generator", href: "/tools/conversion/lorem-ipsum" },
    ],
  },
  {
    title: "Web & Dev Tools",
    items: [
      { name: "Timestamp Converter", href: "/tools/web/timestamp" },
      { name: "JSON Formatter", href: "/tools/web/json-formatter" },
      { name: "Regex Tester", href: "/tools/web/regex" },
      { name: "HTTP Request Tester", href: "/tools/web/http-request" },
      { name: "Link Previewer", href: "/tools/web/link-preview" },
      { name: "CSS Minifier", href: "/tools/web/css-minifier" },
      {
        name: "CSS / Tailwind Unit Converter",
        href: "/tools/web/css-tailwind-unit-converter",
      },
    ],
  },
  {
    title: "Visual & UI Tools",
    items: [
      { name: "Color Picker", href: "/tools/visual/color-picker" },
      {
        name: "Color Palette Generator",
        href: "/tools/visual/color-palet-generator",
      },
      {
        name: "CSS Gradient Generator",
        href: "/tools/visual/gradient-generator",
      },
      { name: "Box Shadow", href: "/tools/visual/box-shadow" },
      {
        name: "Grid Layout Generator",
        href: "/tools/visual/grid-layout-generator",
      },
      { name: "Markdown Previewer", href: "/tools/visual/markdown" },
      { name: "Image to Base64", href: "/tools/visual/image-base64" },
      { name: "Image Compressor", href: "/tools/visual/image-compressor" },
      { name: "Sprite Generator", href: "/tools/visual/sprite-generator" },
    ],
  },
];

function flattenTools() {
  return toolCategories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.title,
    }))
  );
}

function NavbarSearchBar() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [showResults, setShowResults] = React.useState(false);
  const [focusedIdx, setFocusedIdx] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const tools = React.useMemo(flattenTools, []);
  const filtered =
    query.trim().length === 0
      ? []
      : tools.filter(
          (tool) =>
            tool.name.toLowerCase().includes(query.toLowerCase()) ||
            tool.category.toLowerCase().includes(query.toLowerCase())
        );

  // Fermer la liste si on clique ailleurs
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !resultsRef.current?.contains(e.target as Node)
      ) {
        setShowResults(false);
        setFocusedIdx(-1);
      }
    }
    if (showResults) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showResults]);

  // Navigation clavier
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showResults || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIdx((idx) => (idx + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIdx((idx) => (idx - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && focusedIdx >= 0) {
      e.preventDefault();
      router.push(filtered[focusedIdx].href);
      setShowResults(false);
      setQuery("");
      setFocusedIdx(-1);
    }
  }

  return (
    <div className="relative">
      <form
        className="flex items-center gap-2 max-w-xs bg-white dark:bg-muted rounded-full px-3 py-1 border shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (filtered.length > 0) {
            router.push(filtered[0].href);
            setShowResults(false);
            setQuery("");
            setFocusedIdx(-1);
          }
        }}
        autoComplete="off"
      >
        <button
          type="submit"
          className="text-muted-foreground hover:text-primary transition p-0.5"
          tabIndex={-1}
        >
          <Search size={18} />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Rechercher..."
          className="flex-1 bg-transparent border-none focus:outline-none px-1 py-1 text-sm rounded-full"
          aria-label="Rechercher"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
            setFocusedIdx(-1);
          }}
          onFocus={() => {
            if (query.trim().length > 0) setShowResults(true);
          }}
          onKeyDown={handleKeyDown}
        />
      </form>
      {showResults && filtered.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute left-0 mt-2 w-full bg-popover border rounded-lg shadow-lg z-50 max-h-64 overflow-auto"
        >
          {filtered.map((tool, idx) => (
            <button
              key={tool.href}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary focus:bg-secondary rounded-md ${
                idx === focusedIdx ? "bg-secondary" : ""
              }`}
              onClick={() => {
                router.push(tool.href);
                setShowResults(false);
                setQuery("");
                setFocusedIdx(-1);
              }}
              onMouseEnter={() => setFocusedIdx(idx)}
              tabIndex={-1}
            >
              <span className="font-medium">{tool.name}</span>
              <span className="ml-2 text-muted-foreground text-xs">
                {tool.category}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MainNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between py-4 md:py-6 px-4 md:px-6 border-b w-full bg-background">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
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
        <div className="hidden md:block">
          <NavbarSearchBar />
        </div>
        <ThemeToggle />

        <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-xs overflow-y-auto max-h-screen"
          >
            <div className="flex flex-col gap-6 pt-6">
              <NavbarSearchBar />
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
