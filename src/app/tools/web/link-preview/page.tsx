"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Link, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Exemple d'URL à tester
const EXAMPLE_URL = "https://www.lemonde.fr/";

type LinkPreview = {
  title: string;
  description: string;
  image: string;
  url: string;
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
      // Tentative directe de récupération du HTML
      // Note: Cela ne fonctionnera que pour les sites qui permettent les requêtes CORS
      const response = await fetch(url, {
        mode: "cors", // Tente une requête CORS
        headers: {
          Accept: "text/html",
        },
      });

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération de la page - CORS probablement bloqué"
        );
      }

      const html = await response.text();

      // Extraire les métadonnées avec des regex simples
      const title =
        extractTag(html, "title") ||
        extractMetaTag(html, "og:title") ||
        extractMetaTag(html, "twitter:title") ||
        "Titre non disponible";

      const description =
        extractMetaTag(html, "og:description") ||
        extractMetaTag(html, "description") ||
        extractMetaTag(html, "twitter:description") ||
        "Description non disponible";

      const image =
        extractMetaTag(html, "og:image") ||
        extractMetaTag(html, "twitter:image") ||
        "";

      setPreview({
        title,
        description,
        image,
        url,
      });
    } catch (e: any) {
      console.error("Erreur:", e);

      // Message spécifique pour les erreurs CORS courantes
      if (e.message.includes("CORS") || e.name === "TypeError") {
        setError(
          "Cette page ne permet pas l'accès direct depuis le navigateur (erreur CORS). Utilisez un proxy serveur."
        );
      } else {
        setError(e.message || "Erreur inconnue");
      }

      // Solution alternative si CORS échoue - au moins extraire le favicon
      try {
        const domain = new URL(url).hostname;
        setPreview({
          title: domain,
          description:
            "Impossible d'accéder aux métadonnées complètes à cause des restrictions CORS.",
          image: `https://${domain}/favicon.ico`,
          url: url,
        });
      } catch (faviconError) {
        // Ignorer les erreurs de favicon
      }
    } finally {
      setLoading(false);
    }
  };

  // Méthode alternative qui utilise une iframe pour tenter d'extraire les informations
  // Cette approche peut fonctionner dans certains cas mais reste limitée par la sécurité
  const fetchWithIframe = () => {
    setLoading(true);
    setError(null);

    try {
      // Créer une iframe temporaire
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // Définir un timeout pour éviter de bloquer indéfiniment
      const timeoutId = setTimeout(() => {
        setError("Délai d'attente dépassé pour charger la page");
        document.body.removeChild(iframe);
        setLoading(false);
      }, 5000);

      // Essayer de charger l'URL dans l'iframe
      iframe.onload = () => {
        clearTimeout(timeoutId);

        try {
          // Tenter d'accéder au contenu de l'iframe (peut échouer à cause de la sécurité)
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;

          if (!iframeDoc) {
            throw new Error(
              "Impossible d'accéder au contenu de la page (restrictions de sécurité)"
            );
          }

          // Extraire les métadonnées directement du DOM
          const title = iframeDoc.title || "Titre non disponible";

          // Récupérer description depuis meta
          let description = "Description non disponible";
          const metaDesc = iframeDoc.querySelector('meta[name="description"]');
          if (metaDesc) {
            description = metaDesc.getAttribute("content") || description;
          }

          // Tenter de récupérer une image
          let image = "";
          const ogImage = iframeDoc.querySelector('meta[property="og:image"]');
          if (ogImage) {
            image = ogImage.getAttribute("content") || "";
          }

          setPreview({
            title,
            description,
            image,
            url,
          });
        } catch (e: any) {
          setError(e.message || "Erreur lors de l'accès au contenu de la page");
        } finally {
          document.body.removeChild(iframe);
          setLoading(false);
        }
      };

      iframe.onerror = () => {
        clearTimeout(timeoutId);
        setError("Erreur lors du chargement de la page");
        document.body.removeChild(iframe);
        setLoading(false);
      };

      // Définir la source de l'iframe
      iframe.src = url;
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
      setLoading(false);
    }
  };

  // Extraire le contenu d'une balise HTML
  const extractTag = (html: string, tagName: string): string | null => {
    const regex = new RegExp(`<${tagName}[^>]*>(.*?)<\/${tagName}>`, "i");
    const match = html.match(regex);
    return match && match[1] ? match[1].trim() : null;
  };

  // Extraire le contenu d'une balise meta
  const extractMetaTag = (html: string, name: string): string | null => {
    // Chercher d'abord dans property (pour Open Graph)
    const propertyRegex = new RegExp(
      `<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`,
      "i"
    );
    let match = html.match(propertyRegex);

    if (!match) {
      // Ensuite chercher dans name (pour meta standards)
      const nameRegex = new RegExp(
        `<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`,
        "i"
      );
      match = html.match(nameRegex);
    }

    return match && match[1] ? match[1].trim() : null;
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
      description="Prévisualisez le titre, la description et l'image d'une page web à partir de son URL."
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
                <div className="text-amber-600 bg-amber-50 p-2 rounded text-sm flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Note:</strong> Cette version tente de récupérer les
                    données directement, mais de nombreux sites bloquent ce type
                    d'accès (CORS). Pour une solution plus robuste, utilisez un
                    proxy côté serveur.
                  </div>
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
                          // Fallback si l'image ne charge pas
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded border">
                        <Link className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-lg mb-1">
                        {preview.title}
                      </div>
                      <div className="text-muted-foreground mb-2">
                        {preview.description}
                      </div>
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
