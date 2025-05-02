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
      description="Convert your images between PNG, JPEG, and WebP formats directly in your browser."
    >
      <Tabs defaultValue="convert">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="convert">Convert an image</TabsTrigger>
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
      setError("Please select a valid image file.");
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

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputFormat(e.target.value);
    if (file && autoConvert) {
      convertImage(file, e.target.value);
    }
  };

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
        setError("Unable to get canvas context.");
        setLoading(false);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError("Error during conversion.");
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
      setError("Error loading image.");
      setLoading(false);
    };
    img.src = URL.createObjectURL(file);
  };

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
    toast.success("Image downloaded!");
  };

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
          <Label htmlFor="auto-convert">Auto convert</Label>
        </div>
        {!autoConvert && (
          <Button
            onClick={handleManualConvert}
            size="sm"
            disabled={!file || loading}
          >
            Convert
          </Button>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="image-input">Image to convert</Label>
        <div className="flex items-center gap-2">
          <input
            id="image-input"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              (
                document.getElementById("image-input") as HTMLInputElement
              )?.click()
            }
          >
            {/* Use the same icon as in base64 page */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="12.5" r="1.5" />
              <path d="M21 19l-5.5-5.5a2 2 0 0 0-2.8 0L3 19" />
            </svg>
            Choose file
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="format-select">Output format</Label>
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
          <Label>Preview</Label>
          <div className="border rounded p-2 min-h-[180px] flex items-center justify-center bg-muted">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 max-w-full"
              />
            ) : (
              <span className="text-muted-foreground text-sm">
                No image selected
              </span>
            )}
          </div>
        </div>
        <div>
          <Label>Result</Label>
          <div className="border rounded p-2 min-h-[180px] flex items-center justify-center bg-muted">
            {loading ? (
              <span className="text-muted-foreground text-sm">
                Converting...
              </span>
            ) : outputUrl ? (
              <img
                src={outputUrl}
                alt="Converted"
                className="max-h-48 max-w-full"
              />
            ) : (
              <span className="text-muted-foreground text-sm">No result</span>
            )}
          </div>
          {outputUrl && (
            <Button className="mt-2" onClick={handleDownload} size="sm">
              Download
            </Button>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
        <p>
          <strong>Image Converter</strong>: convert your PNG, JPEG, or WebP
          images to another format without leaving your browser. No files are
          sent to a server.
        </p>
      </div>
    </div>
  );
}
