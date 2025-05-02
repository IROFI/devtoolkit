"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Exemple de CSS à minifier
const EXAMPLE_CSS = `
/* Exemple de CSS */
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
    .replace(/\/\*[\s\S]*?\*\//g, "") // Supprime les commentaires
    .replace(/\s{2,}/g, " ") // Réduit les espaces multiples
    .replace(/\s*([{}:;,])\s*/g, "$1") // Supprime les espaces autour des symboles
    .replace(/;}/g, "}") // Supprime le ; avant }
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
        toast.warning("Le CSS minifié est vide.");
      } else {
        toast.success("CSS minifié !");
      }
    } catch (e: any) {
      setError("Erreur lors de la minification.");
      setMinified("");
    }
  };

  const fillExample = () => {
    setCss(EXAMPLE_CSS.trim());
    setMinified("");
    setError(null);
    toast.info("Exemple chargé !");
  };

  return (
    <ToolLayout
      title="CSS Minifier"
      description="Minifiez votre code CSS facilement."
    >
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
                  title="Charger un exemple"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Exemple
                </Button>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="css-input">CSS à minifier</Label>
                <textarea
                  id="css-input"
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  rows={8}
                  className="font-mono p-2 border rounded resize-y"
                  placeholder="Collez votre CSS ici..."
                />
                <Button onClick={handleMinify} disabled={!css}>
                  Minifier
                </Button>
              </div>
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  Erreur : {error}
                </div>
              )}
              {minified && (
                <div className="mt-4">
                  <Label>Résultat minifié</Label>
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
