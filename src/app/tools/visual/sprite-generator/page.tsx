"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download, Image as ImageIcon } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

export default function SpriteGeneratorPage() {
  const [images, setImages] = useState<File[]>([]);
  const [spriteUrl, setSpriteUrl] = useState<string>("");
  const [spacing, setSpacing] = useState<number>(0);
  const [spriteSize, setSpriteSize] = useState<number>(0);
  const [previews, setPreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages(files);
    setSpriteUrl("");
    setSpriteSize(0);

    // Generate previews
    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject();
            reader.readAsDataURL(file);
          })
      )
    )
      .then((results) => {
        setPreviews(results);
        generateSprite(results, spacing);
      })
      .catch(() => toast.error("Error while reading files"));
  };

  const generateSprite = (dataUrls: string[], spacing: number) => {
    if (!dataUrls.length) return;
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    dataUrls.forEach((url, idx) => {
      const img = new window.Image();
      img.onload = () => {
        images[idx] = img;
        loaded++;
        if (loaded === dataUrls.length) {
          // All images loaded
          const width =
            images.reduce((sum, img) => sum + img.width, 0) +
            spacing * (images.length - 1);
          const height = Math.max(...images.map((img) => img.height));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            toast.error("Error while generating sprite");
            return;
          }
          let x = 0;
          images.forEach((img, i) => {
            ctx.drawImage(img, x, 0);
            x += img.width + spacing;
          });
          const spriteDataUrl = canvas.toDataURL("image/png");
          setSpriteUrl(spriteDataUrl);
          // Size in bytes
          const base64Length =
            spriteDataUrl.length - "data:image/png;base64,".length;
          const sizeInBytes = Math.ceil((base64Length * 3) / 4);
          setSpriteSize(sizeInBytes);
        }
      };
      img.onerror = () => toast.error("Error loading an image");
      img.src = url;
    });
  };

  const handleSpacingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const s = parseInt(e.target.value, 10);
    setSpacing(s);
    if (previews.length) {
      generateSprite(previews, s);
    }
  };

  const downloadSprite = () => {
    if (!spriteUrl) return;
    const a = document.createElement("a");
    a.href = spriteUrl;
    a.download = "sprite.png";
    a.click();
  };

  return (
    <ToolLayout
      title="Sprite Generator"
      description="Generate a horizontal sprite from multiple images."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-sm">Images</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFilesChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4 mr-1" />
              Choose images
            </Button>
          </div>
          {previews.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {previews.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preview ${i + 1}`}
                  className="h-16 rounded border"
                />
              ))}
            </div>
          )}
          {previews.length > 0 && (
            <div className="mb-4">
              <Label className="text-xs mb-1 block">
                Spacing between images: {spacing}px
              </Label>
              <input
                type="range"
                min={0}
                max={64}
                step={1}
                value={spacing}
                onChange={handleSpacingChange}
                className="w-full"
              />
            </div>
          )}
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-sm">Generated sprite</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={downloadSprite}
                  disabled={!spriteUrl}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              {spriteUrl ? (
                <>
                  <img
                    src={spriteUrl}
                    alt="Generated sprite"
                    className="max-h-48 rounded border mb-2"
                  />
                  <div className="text-xs text-muted-foreground mb-2">
                    Size: {(spriteSize / 1024).toFixed(2)} KB
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground">
                  The sprite will appear here...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
