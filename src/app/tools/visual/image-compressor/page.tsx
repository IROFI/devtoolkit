"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download, Image as ImageIcon } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

export default function ImageCompressorPage() {
  const [image, setImage] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [quality, setQuality] = useState<number>(0.7);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setCompressedUrl("");
    setCompressedSize(0);

    const reader = new FileReader();
    reader.onload = () => {
      setOriginalUrl(reader.result as string);
      setOriginalSize(file.size);
      compressImage(reader.result as string, quality);
    };
    reader.onerror = () => {
      toast.error("Erreur lors de la lecture du fichier");
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (dataUrl: string, quality: number) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Erreur lors de la compression");
        return;
      }
      ctx.drawImage(img, 0, 0);
      // JPEG pour la compression universelle
      const compressed = canvas.toDataURL("image/jpeg", quality);
      setCompressedUrl(compressed);

      // Calculer la taille en octets
      const base64Length = compressed.length - "data:image/jpeg;base64,".length;
      const sizeInBytes = Math.ceil((base64Length * 3) / 4);
      setCompressedSize(sizeInBytes);
    };
    img.onerror = () => {
      toast.error("Erreur lors du chargement de l'image");
    };
    img.src = dataUrl;
  };

  const handleQualityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const q = parseFloat(e.target.value);
    setQuality(q);
    if (originalUrl) {
      compressImage(originalUrl, q);
    }
  };

  const downloadCompressed = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = "compressed.jpg";
    a.click();
  };

  return (
    <ToolLayout
      title="Compresseur d'image"
      description="Compressez vos images facilement et téléchargez-les."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-sm">Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4 mr-1" />
              Choisir une image
            </Button>
          </div>
          {originalUrl && (
            <div className="mb-4">
              <Label className="text-xs mb-1 block">Aperçu original</Label>
              <img
                src={originalUrl}
                alt="Aperçu original"
                className="max-h-48 rounded border"
              />
              <div className="text-xs mt-1 text-muted-foreground">
                Taille : {(originalSize / 1024).toFixed(2)} Ko
              </div>
            </div>
          )}
          {originalUrl && (
            <div className="mb-4">
              <Label className="text-xs mb-1 block">
                Qualité de compression : {(quality * 100).toFixed(0)}%
              </Label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.01}
                value={quality}
                onChange={handleQualityChange}
                className="w-full"
              />
            </div>
          )}
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-sm">Image compressée</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={downloadCompressed}
                  disabled={!compressedUrl}
                  title="Télécharger"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              {compressedUrl ? (
                <>
                  <img
                    src={compressedUrl}
                    alt="Image compressée"
                    className="max-h-48 rounded border mb-2"
                  />
                  <div className="text-xs text-muted-foreground mb-2">
                    Taille : {(compressedSize / 1024).toFixed(2)} Ko
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground">
                  L'image compressée apparaîtra ici...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
