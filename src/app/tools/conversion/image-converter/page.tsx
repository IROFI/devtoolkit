"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const SUPPORTED_FORMATS = [
  { label: "PNG", value: "image/png" },
  { label: "JPEG", value: "image/jpeg" },
  { label: "WebP", value: "image/webp" },
];

export default function ImageConverterPage() {
  return (
    <ToolLayout
      title="Image Converter"
      description="Convertissez vos images entre les formats PNG, JPEG et WebP directement dans votre navigateur."
    >
      <Tabs defaultValue="convert">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="convert">Convertir une image</TabsTrigger>
        </TabsList>
        <TabsContent value="convert">
          <ImageConverter />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}

function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [outputUrl, setOutputUrl] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<string>("image/png");
  const [autoConvert, setAutoConvert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Gère le chargement du fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setOutputUrl("");
    const file = e.target.files?.[0];
    if (!file) {
      setFile(null);
      setPreviewUrl("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image valide.");
      setFile(null);
      setPreviewUrl("");
      return;
    }
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (autoConvert) {
      setTimeout(() => convertImage(file, outputFormat), 100);
    }
  };

  // Gère le changement de format de sortie
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputFormat(e.target.value);
    if (file && autoConvert) {
      convertImage(file, e.target.value);
    }
  };

  // Conversion de l'image
  const convertImage = (file: File, format: string) => {
    setLoading(true);
    setError("");
    setOutputUrl("");
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Impossible d'obtenir le contexte du canvas.");
        setLoading(false);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError("Erreur lors de la conversion.");
            setLoading(false);
            return;
          }
          setOutputUrl(URL.createObjectURL(blob));
          setLoading(false);
        },
        format,
        format === "image/jpeg" ? 0.92 : undefined
      );
    };
    img.onerror = () => {
      setError("Erreur lors du chargement de l'image.");
      setLoading(false);
    };
    img.src = URL.createObjectURL(file);
  };

  // Téléchargement du résultat
  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement("a");
    a.href = outputUrl;
    const ext =
      SUPPORTED_FORMATS.find(
        (f) => f.value === outputFormat
      )?.label.toLowerCase() || "img";
    a.download = `converted.${ext}`;
    a.click();
    toast.success("Image téléchargée !");
  };

  // Conversion manuelle
  const handleManualConvert = () => {
    if (file) convertImage(file, outputFormat);
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-convert"
            checked={autoConvert}
            onCheckedChange={setAutoConvert}
          />
          <Label htmlFor="auto-convert">Conversion automatique</Label>
        </div>
        {!autoConvert && (
          <Button
            onClick={handleManualConvert}
            size="sm"
            disabled={!file || loading}
          >
            Convertir
          </Button>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="image-input">Image à convertir</Label>
        <input
          id="image-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="block"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="format-select">Format de sortie</Label>
        <select
          id="format-select"
          value={outputFormat}
          onChange={handleFormatChange}
          className="border rounded px-2 py-1"
        >
          {SUPPORTED_FORMATS.map((fmt) => (
            <option key={fmt.value} value={fmt.value}>
              {fmt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Prévisualisation</Label>
          <div className="border rounded p-2 min-h-[180px] flex items-center justify-center bg-muted">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Aperçu"
                className="max-h-48 max-w-full"
              />
            ) : (
              <span className="text-muted-foreground text-sm">
                Aucune image sélectionnée
              </span>
            )}
          </div>
        </div>
        <div>
          <Label>Résultat</Label>
          <div className="border rounded p-2 min-h-[180px] flex items-center justify-center bg-muted">
            {loading ? (
              <span className="text-muted-foreground text-sm">
                Conversion en cours...
              </span>
            ) : outputUrl ? (
              <img
                src={outputUrl}
                alt="Converti"
                className="max-h-48 max-w-full"
              />
            ) : (
              <span className="text-muted-foreground text-sm">
                Aucun résultat
              </span>
            )}
          </div>
          {outputUrl && (
            <Button className="mt-2" onClick={handleDownload} size="sm">
              Télécharger
            </Button>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
        <p>
          <strong>Convertisseur d'image</strong> : convertissez vos images PNG,
          JPEG ou WebP dans un autre format sans quitter votre navigateur. Aucun
          fichier n'est envoyé sur un serveur.
        </p>
      </div>
    </div>
  );
}
