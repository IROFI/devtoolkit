"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Example CSS to minify
const EXAMPLE_CSS = `
/* Example CSS */
body {
  background: #fff;
  color: #333;
  margin: 0;
  padding: 0;
}
h1, h2 {
  font-weight: bold;
  margin-bottom: 1rem;
}
a {
  color: blue;
  text-decoration: underline;
}
`;

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
    .replace(/\s{2,}/g, " ") // Reduce multiple spaces
    .replace(/\s*([{}:;,])\s*/g, "$1") // Remove spaces around symbols
    .replace(/;}/g, "}") // Remove ; before }
    .replace(/^\s+|\s+$/g, ""); // Trim
}

export default function CssMinifierPage() {
  const [css, setCss] = useState("");
  const [minified, setMinified] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleMinify = () => {
    setError(null);
    try {
      const result = minifyCss(css);
      setMinified(result);
      if (!result) {
        toast.warning("The minified CSS is empty.");
      } else {
        toast.success("CSS minified!");
      }
    } catch (e: any) {
      setError("Error during minification.");
      setMinified("");
    }
  };

  const fillExample = () => {
    setCss(EXAMPLE_CSS.trim());
    setMinified("");
    setError(null);
    toast.info("Example loaded!");
  };

  return (
    <ToolLayout title="CSS Minifier" description="Easily minify your CSS code.">
      <div className="grid gap-8">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">CSS Minifier</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fillExample}
                  className="h-8 px-2"
                  title="Load example"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Example
                </Button>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="css-input">CSS to minify</Label>
                <textarea
                  id="css-input"
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  rows={8}
                  className="font-mono p-2 border rounded resize-y"
                  placeholder="Paste your CSS here..."
                />
                <Button onClick={handleMinify} disabled={!css}>
                  Minify
                </Button>
              </div>
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  Error: {error}
                </div>
              )}
              {minified && (
                <div className="mt-4">
                  <Label>Minified result</Label>
                  <pre
                    className="font-mono p-2 border rounded bg-gray-50 mt-1 overflow-x-auto text-sm select-all"
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                  >
                    {minified}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
