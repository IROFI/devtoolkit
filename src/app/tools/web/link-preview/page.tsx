"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Exemple d'URL à tester
const EXAMPLE_URL = "https://www.lemonde.fr/";

type LinkPreview = {
  title: string;
  description: string;
  image: string;
  favicon?: string;
  url: string;
  publishDate?: string;
};

export default function LinkPreviewPage() {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL");
      return;
    }

    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const response = await fetch("/api/link-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Erreur lors de la récupération des métadonnées"
        );
      }

      const data = await response.json();
      setPreview(data);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Remplit avec l'exemple
  const fillExample = () => {
    setUrl(EXAMPLE_URL);
    setPreview(null);
    setError(null);
    toast.info("Exemple chargé !");
  };

  return (
    <ToolLayout
      title="Link Previewer"
      description="Preview the metadata of a link before sharing it."
    >
      <div className="grid gap-8">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Link Previewer</h3>
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
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor="url-input">URL</Label>
                    <Input
                      id="url-input"
                      type="text"
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <Button
                    onClick={fetchPreview}
                    disabled={loading || !url}
                    className="h-10"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      "Prévisualiser"
                    )}
                  </Button>
                </div>
              </div>
              <div>
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    Erreur : {error}
                  </div>
                )}
                {preview && (
                  <div className="mt-4 flex gap-4 items-start border p-4 rounded">
                    {preview.image ? (
                      <img
                        src={preview.image}
                        alt={preview.title || "Aperçu"}
                        className="w-32 h-32 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded border">
                        <Link className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {preview.favicon && (
                          <img
                            src={preview.favicon}
                            alt="favicon"
                            className="w-5 h-5 rounded"
                            style={{ display: "inline-block" }}
                          />
                        )}
                        <span className="font-bold text-lg">
                          {preview.title}
                        </span>
                      </div>
                      <div className="text-muted-foreground mb-2">
                        {preview.description}
                      </div>
                      {preview.publishDate && (
                        <div className="text-xs text-gray-500 mb-1">
                          Publié le :{" "}
                          {new Date(preview.publishDate).toLocaleString()}
                        </div>
                      )}
                      <a
                        href={preview.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <Link className="h-3 w-3" />
                        {preview.url}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
