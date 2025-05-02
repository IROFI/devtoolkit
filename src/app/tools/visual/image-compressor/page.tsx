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
      toast.error("Error while reading the file");
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
        toast.error("Error during compression");
        return;
      }
      ctx.drawImage(img, 0, 0);
      const compressed = canvas.toDataURL("image/jpeg", quality);
      setCompressedUrl(compressed);

      const base64Length = compressed.length - "data:image/jpeg;base64,".length;
      const sizeInBytes = Math.ceil((base64Length * 3) / 4);
      setCompressedSize(sizeInBytes);
    };
    img.onerror = () => {
      toast.error("Error loading the image");
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
      title="Image Compressor"
      description="Easily compress your images and download them."
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
              Choose an image
            </Button>
          </div>
          {originalUrl && (
            <div className="mb-4">
              <Label className="text-xs mb-1 block">Original preview</Label>
              <img
                src={originalUrl}
                alt="Original preview"
                className="max-h-48 rounded border"
              />
              <div className="text-xs mt-1 text-muted-foreground">
                Size: {(originalSize / 1024).toFixed(2)} KB
              </div>
            </div>
          )}
          {originalUrl && (
            <div className="mb-4">
              <Label className="text-xs mb-1 block">
                Compression quality: {(quality * 100).toFixed(0)}%
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
                <Label className="text-sm">Compressed image</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={downloadCompressed}
                  disabled={!compressedUrl}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              {compressedUrl ? (
                <>
                  <img
                    src={compressedUrl}
                    alt="Compressed image"
                    className="max-h-48 rounded border mb-2"
                  />
                  <div className="text-xs text-muted-foreground mb-2">
                    Size: {(compressedSize / 1024).toFixed(2)} KB
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground">
                  The compressed image will appear here...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
